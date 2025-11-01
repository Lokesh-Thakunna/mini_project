import React, { useState } from "react";
import { initBlockchain, withdrawFund} from "../services/blockchain";

const UseFund = () => {
  const [schemeId, setSchemeId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // 🔹 Connect wallet
  const connectWallet = async () => {
    const contract = await initBlockchain();
    if (contract) setConnected(true);
  };

  // 🔹 Use fund for a specific scheme
  
  const handleUseFund = async (e) => {
    e.preventDefault();
    if (!connected) {
      alert("Please connect MetaMask first!");
      return;
    }

    if (!schemeId || !amount) {
      alert("Please fill in both fields!");
      return;
    }

    setLoading(true);
    try {
      await withdrawFund(schemeId, amount);
      alert(`✅ Used ${amount} ETH from Scheme ID ${schemeId}`);
      setSchemeId("");
      setAmount("");
    } catch (error) {
      console.error(error);
      alert("❌ Transaction failed! Check console for details.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Use Scheme Funds</h1>

      {!connected ? (
        <button
          onClick={connectWallet}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Connect MetaMask
        </button>
      ) : (
        <p className="text-green-600 mb-4 font-semibold">✅ Wallet Connected</p>
      )}

      <form
        onSubmit={handleUseFund}
        className="bg-white p-8 shadow-lg rounded-2xl w-96 mt-4"
      >
        <label className="block text-gray-700 mb-2">Scheme ID:</label>
        <input
          type="number"
          value={schemeId}
          onChange={(e) => setSchemeId(e.target.value)}
          placeholder="Enter scheme ID (e.g., 1)"
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block text-gray-700 mb-2">Funds Used (INR):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Use Fund"}
        </button>
      </form>
    </div>
  );
};

export default UseFund;
