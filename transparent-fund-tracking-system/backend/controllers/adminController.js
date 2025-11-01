const contract = require('../utils/contract');
const Fund = require('../models/Fund');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Get aggregated stats (DB + blockchain sync)
exports.getStats = async (req, res) => {
  try {
    let totalSchemes = 0;
    let totalAllocated = 0;
    let totalUsed = 0;
    let recentActivities = [];

    // If DB is connected, use DB values. Otherwise, fallback to on-chain reads.
    if (mongoose.connection.readyState === 1) {
      const funds = await Fund.find();
      totalSchemes = funds.length;
      totalAllocated = funds.reduce((s, f) => s + (f.totalFunds || 0), 0);
      totalUsed = funds.reduce((s, f) => s + (f.usedFunds || 0), 0);
      recentActivities = await Transaction.find().sort({ createdAt: -1 }).limit(5);
    } else {
      // fallback: read on-chain schemes
      try {
        const count = Number(await contract.schemeCount());
        totalSchemes = count;
        for (let i = 0; i < count; i++) {
          const s = await contract.getScheme(i);
          totalAllocated += Number(s.totalFunds.toString());
          totalUsed += Number(s.usedFunds.toString());
        }
      } catch (err) {
        console.error('Failed to fetch on-chain schemes for stats fallback', err);
      }
      recentActivities = [];
    }

    res.json({ totalSchemes, totalAllocated, totalUsed, recentActivities });
  } catch (err) {
    console.error('Error in getStats', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// List schemes from blockchain (falls back to DB if needed)
exports.listSchemes = async (req, res) => {
  try {
    const count = Number(await contract.schemeCount());
    const schemes = [];
    for (let i = 0; i < count; i++) {
      const s = await contract.getScheme(i);
      schemes.push({
        id: Number(s.id.toString()),
        name: s.name,
        totalFunds: Number(s.totalFunds.toString()),
        usedFunds: Number(s.usedFunds.toString()),
      });
    }
    return res.json(schemes);
  } catch (err) {
    console.error('Error listing schemes from blockchain, falling back to DB', err);
    try {
      const funds = await Fund.find();
      return res.json(funds);
    } catch (dbErr) {
      console.error('DB fallback also failed', dbErr);
      return res.json([]);
    }
  }
};

// Add scheme: create on blockchain then save to DB with schemeId mapping
exports.addScheme = async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (!name || amount == null) return res.status(400).json({ message: 'Missing fields' });

    // Call contract addScheme (assumes wallet has funds and is configured)
    const tx = await contract.addScheme(name, amount);
    await tx.wait();

    // Get new scheme id (schemeCount - 1)
    const schemeCountBN = await contract.schemeCount();
    const schemeId = Number(schemeCountBN.toString()) - 1;

    if (mongoose.connection.readyState === 1) {
      const fundDoc = new Fund({ name, totalFunds: amount, usedFunds: 0, schemeId });
      await fundDoc.save();
    } else {
      console.warn('DB not connected: skipping saving scheme mapping to DB');
    }

    res.json({ message: 'Scheme added', schemeId });
  } catch (err) {
    console.error('Error adding scheme', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Use fund: call contract useFund and record Transaction and update DB
exports.useFund = async (req, res) => {
  try {
    const { schemeId, amount, executor, purpose } = req.body;
    if (schemeId == null || amount == null || !executor) return res.status(400).json({ message: 'Missing fields' });

    // Call contract
    const tx = await contract.useFund(schemeId, amount);
    const receipt = await tx.wait();

    // Record transaction and update DB if possible
    if (mongoose.connection.readyState === 1) {
      const t = new Transaction({ schemeId, amount, executor, purpose: purpose || 'Fund usage', txHash: receipt.transactionHash });
      await t.save();

      const fund = await Fund.findOne({ schemeId });
      if (fund) {
        fund.usedFunds = (fund.usedFunds || 0) + Number(amount);
        await fund.save();
      }
    } else {
      console.warn('DB not connected: skipping saving transaction and updating fund');
    }

    res.json({ message: 'Fund used', txHash: receipt.transactionHash });
  } catch (err) {
    console.error('Error using fund', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

