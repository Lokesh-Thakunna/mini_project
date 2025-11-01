const { wallet, ethers } = require("./provider");
const FundTrackerABI = require("../FundTrackerABI.json");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

let contract = null;
try {
	if (!CONTRACT_ADDRESS) throw new Error('Missing CONTRACT_ADDRESS');
	contract = new ethers.Contract(CONTRACT_ADDRESS, FundTrackerABI.abi, wallet);
} catch (err) {
	console.error('Failed to create contract instance', err);
}

module.exports = contract;
