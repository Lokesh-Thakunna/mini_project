# Quick Start Guide - Fix Blockchain Connection

## Problem
You're seeing these errors:
- `⚠️ No contract found at address 0x5FbDB2315678afecb367f032d93F642f64180aa3`
- `❌ Blockchain error: Blockchain not available`

## Solution (3 Simple Steps)

### Step 1: Start Hardhat Node

Open a **new terminal/PowerShell window** and run:

```powershell
cd transparent-fund-tracking-system\blockchain
npx hardhat node
```

**Keep this terminal open!** You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Step 2: Deploy the Contract

Open **another terminal/PowerShell window** and run:

```powershell
cd transparent-fund-tracking-system\blockchain
npx hardhat run scripts/deploy.js --network localhost
```

You'll see output like:
```
✅ FundTracker deployed successfully!
📝 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
👤 Deployer Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**Copy the Contract Address** (the one starting with `0x5FbDB...`)

### Step 3: Update Backend .env File

Create or update `transparent-fund-tracking-system\backend\.env` file:

```env
# Blockchain Configuration
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=<PASTE_THE_CONTRACT_ADDRESS_FROM_STEP_2>

# MongoDB Configuration
MONGO_URI=mongodb://127.0.0.1:27017/fundtracker

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Important:**
- Replace `<PASTE_THE_CONTRACT_ADDRESS_FROM_STEP_2>` with the actual address from Step 2
- The `PRIVATE_KEY` shown is the default Hardhat account #0 (safe for local development only)

### Step 4: Restart Backend

Restart your backend server. You should now see:
```
✅ Contract initialized at <your-contract-address>
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

## Alternative: Use Setup Script

You can also use the automated script:

```powershell
cd transparent-fund-tracking-system\blockchain
.\setup-blockchain.bat
```

## Troubleshooting

### "Hardhat node is not running"
- Make sure Step 1 is completed and the terminal is still open
- The node must be running before deploying

### "Contract not found"
- Make sure you completed Step 2 (deployment)
- Verify the `CONTRACT_ADDRESS` in `.env` matches the deployed address

### "Wallet not initialized"
- Check that `PRIVATE_KEY` is set in `.env`
- Make sure it starts with `0x`

## Note

The system will work in **database-only mode** if blockchain is unavailable, but you'll see warnings. For full functionality, follow the steps above.

