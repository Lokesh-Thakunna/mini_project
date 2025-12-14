@echo off
echo ==========================================
echo   Blockchain Setup Script
echo ==========================================
echo.

echo This script will help you set up the blockchain.
echo.
echo STEP 1: Start Hardhat Node
echo --------------------------
echo Please open a NEW terminal window and run:
echo   cd blockchain
echo   npx hardhat node
echo.
echo Keep that terminal open and press any key when the node is running...
pause

echo.
echo STEP 2: Deploying Contract
echo -------------------------
echo Deploying contract to localhost...
call npx hardhat run scripts/deploy.js --network localhost

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Deployment failed!
    echo Make sure the Hardhat node is running in another terminal.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   IMPORTANT: Next Steps
echo ==========================================
echo.
echo 1. Copy the Contract Address shown above
echo 2. Copy the Deployer Address shown above
echo 3. Update your backend/.env file with:
echo    - CONTRACT_ADDRESS=<the-contract-address>
echo    - PRIVATE_KEY=<the-deployer-private-key>
echo    - RPC_URL=http://127.0.0.1:8545
echo.
echo The default Hardhat account private key is:
echo 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
echo.
pause

