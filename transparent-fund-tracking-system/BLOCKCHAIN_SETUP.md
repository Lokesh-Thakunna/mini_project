# Blockchain Setup Guide

This guide will help you set up and deploy the FundTracker smart contract to your local Hardhat node.

## Prerequisites

1. Make sure you have Node.js installed
2. Install dependencies in the blockchain folder:
   ```bash
   cd blockchain
   npm install
   ```

## Step-by-Step Setup

### Step 1: Start Hardhat Node

Open a **new terminal window** and run:

```bash
cd blockchain
npx hardhat node
```

This will start a local blockchain node on `http://127.0.0.1:8545`. **Keep this terminal open** - the node must be running for the backend to work.

You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...
```

### Step 2: Deploy the Contract

Open **another terminal window** and run:

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

This will deploy the contract and output something like:
```
✅ FundTracker deployed successfully!
📝 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
👤 Deployer Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**Copy the Contract Address** - you'll need it in the next step.

### Step 3: Configure Backend Environment

Create a `.env` file in the `backend` folder (if it doesn't exist) and add:

```env
# Blockchain Configuration
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=<PASTE_THE_CONTRACT_ADDRESS_FROM_STEP_2>

# MongoDB Configuration
MONGO_URI=mongodb://127.0.0.1:27017/fundtracker

# JWT Secret (change in production)
JWT_SECRET=your-secret-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Replace `<PASTE_THE_CONTRACT_ADDRESS_FROM_STEP_2>` with the actual contract address from Step 2
- The `PRIVATE_KEY` shown above is the default Hardhat account #0 private key. This matches the first account in the Hardhat node.
- If you use a different account, make sure the `PRIVATE_KEY` matches one of the accounts from the Hardhat node.

### Step 4: Restart Backend Server

After setting up the `.env` file, restart your backend server:

```bash
cd backend
npm start
```

You should now see:
```
✅ Contract initialized at <your-contract-address>
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

## Troubleshooting

### Error: "Blockchain not available"
- Make sure the Hardhat node is running (Step 1)
- Check that `RPC_URL` in `.env` is `http://127.0.0.1:8545`
- Verify the Hardhat node is accessible by visiting `http://127.0.0.1:8545` in your browser (should show JSON-RPC response)

### Error: "No contract found at address"
- Make sure you deployed the contract (Step 2)
- Verify `CONTRACT_ADDRESS` in `.env` matches the deployed address
- Try deploying again and updating the address

### Error: "Wallet not initialized"
- Check that `PRIVATE_KEY` is set in `.env`
- Make sure the private key matches one of the accounts in the Hardhat node
- The private key should start with `0x`

### Contract Address Mismatch
If you see warnings about contract address, you can:
1. Deploy a new contract (Step 2)
2. Update `CONTRACT_ADDRESS` in `.env`
3. Restart the backend server

## Quick Deployment Scripts

### Windows (PowerShell)
```powershell
cd blockchain
.\deploy.bat
```

### Linux/Mac
```bash
cd blockchain
chmod +x deploy.sh
./deploy.sh
```

## Alternative: Database-Only Mode

If you don't want to use blockchain, the system will work in database-only mode. However, you'll see warnings and some features may be limited. The system will automatically fall back to database operations when blockchain is unavailable.

