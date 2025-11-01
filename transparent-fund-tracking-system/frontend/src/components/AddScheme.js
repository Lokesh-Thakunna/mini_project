import React, { useState } from "react";
import { initBlockchain, addScheme } from "../services/blockchain";

const AddScheme = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // 🔹 Connect to blockchain
  const connectWallet = async () => {
    const contract = await initBlockchain();
    if (contract) setConnected(true);
  };

  // 🔹 Add new scheme
  const handleAddScheme = async (e) => {
    e.preventDefault();
    if (!connected) {
      alert("Please connect your MetaMask wallet first!");
      return;
    }

    if (!name || !amount) {
      alert("Please fill in both fields!");
      return;
    }

    setLoading(true);
    try {
      await addScheme(name, amount);
      alert(`✅ Scheme "${name}" added successfully!`);
      setName("");
      setAmount("");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add scheme. Check console for details.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Add New Government Scheme</h1>

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
        onSubmit={handleAddScheme}
        className="bg-white p-8 shadow-lg rounded-2xl w-96 mt-4"
      >
        <label className="block text-gray-700 mb-2">Scheme Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter scheme name (e.g., PMAY-2025)"
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block text-gray-700 mb-2">Total Funds(INR):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Eg.:-10000000"
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Scheme"}
        </button>
      </form>
    </div>
  );
};

export default AddScheme;
