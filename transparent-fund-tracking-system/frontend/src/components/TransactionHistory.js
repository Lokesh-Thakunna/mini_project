import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Transaction History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6">Scheme ID</th>
              <th className="py-3 px-6">Amount (INR)</th>
              <th className="py-3 px-6">Purpose</th>
              <th className="py-3 px-6">Executor</th>
              <th className="py-3 px-6">Tx Hash</th>
              <th className="py-3 px-6">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6 text-center">{tx.schemeId}</td>
                <td className="py-3 px-6 text-center">{tx.amount}</td>
                <td className="py-3 px-6 text-center">{tx.purpose}</td>
                <td className="py-3 px-6 text-center">{tx.executor}</td>
                <td className="py-3 px-6 text-center text-blue-600 underline">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </td>
                <td className="py-3 px-6 text-center">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
