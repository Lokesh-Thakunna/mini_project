const { ethers } = require("ethers");
require("dotenv").config();

// Connect to local blockchain
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
let provider = null;
let wallet = null;

try {
  provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // Use your account to sign transactions
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  
  if (PRIVATE_KEY) {
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  } else {
    console.warn("⚠️ PRIVATE_KEY not found in .env file. Blockchain features will be limited.");
    console.warn("   Add PRIVATE_KEY to backend/.env to enable blockchain functionality.");
  }
} catch (error) {
  console.error("❌ Error initializing blockchain provider:", error.message);
  console.error("   Make sure RPC_URL is correct in backend/.env");
}

module.exports = { provider, wallet, ethers };
