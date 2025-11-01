import React, { useEffect, useState } from "react";
import { initBlockchain, getSchemes } from "../services/blockchain";

const ViewSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  // 🔹 Connect to blockchain and load schemes
  useEffect(() => {
    const loadSchemes = async () => {
      const contract = await initBlockchain();
      if (contract) {
        setConnected(true);
        const allSchemes = await getSchemes();
        setSchemes(allSchemes);
      }
      setLoading(false);
    };
    loadSchemes();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Government Funded Schemes
      </h1>

      {!connected && (
        <p className="text-center text-red-600 font-semibold mb-4">
          ⚠️ Please connect MetaMask to view schemes.
        </p>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading schemes...</p>
      ) : schemes.length === 0 ? (
        <p className="text-center text-gray-600">No schemes found on blockchain.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                {scheme.name}
              </h2>
              <p className="text-gray-700 mb-1">
                <strong>Beneficiary:</strong> {scheme.beneficiary}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Total Funds:</strong> {scheme.totalFunds} ETH
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Used Funds:</strong> {scheme.usedFunds} ETH
              </p>
              <p className="text-gray-700">
                <strong>Remaining:</strong>{" "}
                {scheme.totalFunds - scheme.usedFunds} ETH
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewSchemes;
