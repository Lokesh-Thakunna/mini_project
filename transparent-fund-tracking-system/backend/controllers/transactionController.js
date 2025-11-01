const Transaction = require("../models/Transaction");

// ✅ Save new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { schemeId, amount, purpose, executor, txHash } = req.body;

    const newTx = new Transaction({
      schemeId,
      amount,
      purpose,
      executor,
      txHash,
    });

    await newTx.save();
    res.status(201).json({ message: "Transaction saved successfully", transaction: newTx });
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction" });
  }
};

// ✅ Get all transactions (with optional filters)
exports.getTransactions = async (req, res) => {
  try {
    const { schemeId, fromDate, toDate, minAmount, maxAmount } = req.query;
    let filter = {};

    if (schemeId) filter.schemeId = schemeId;
    if (minAmount || maxAmount)
      filter.amount = {
        ...(minAmount ? { $gte: minAmount } : {}),
        ...(maxAmount ? { $lte: maxAmount } : {}),
      };
    if (fromDate || toDate)
      filter.timestamp = {
        ...(fromDate ? { $gte: new Date(fromDate) } : {}),
        ...(toDate ? { $lte: new Date(toDate) } : {}),
      };

    const transactions = await Transaction.find(filter).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
