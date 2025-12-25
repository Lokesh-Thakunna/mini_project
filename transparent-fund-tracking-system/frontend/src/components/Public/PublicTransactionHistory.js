import React, { useState, useEffect, useCallback } from "react";
import {
  fetchPublicTransactions,
  fetchPublicSchemes,
} from "../../services/publicApi";

const PublicTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    schemeId: "",
    fromDate: "",
    toDate: "",
    minAmount: "",
    maxAmount: "",
    search: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [txData, schemeData] = await Promise.all([
        fetchPublicTransactions(filters),
        fetchPublicSchemes(),
      ]);
      setTransactions(txData);
      setSchemes(schemeData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString("en-IN") : "-";

  const shorten = (str) =>
    str && str.length > 20 ? `${str.slice(0, 10)}...${str.slice(-8)}` : str || "-";

  const getExplorerUrl = (hash) =>
    hash?.startsWith("0x")
      ? `https://sepolia.etherscan.io/tx/${hash}`
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

      {/* HEADER */}
      <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">
        Transaction History
      </h2>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Select
          label="Scheme"
          name="schemeId"
          value={filters.schemeId}
          onChange={handleChange}
          options={[
            { label: "All Schemes", value: "" },
            ...schemes.map((s) => ({ label: s.name, value: s.id })),
          ]}
        />
        <Input label="From Date" type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} />
        <Input label="To Date" type="date" name="toDate" value={filters.toDate} onChange={handleChange} />
        <Input label="Min Amount" name="minAmount" value={filters.minAmount} onChange={handleChange} placeholder="Min" />
        <Input label="Max Amount" name="maxAmount" value={filters.maxAmount} onChange={handleChange} placeholder="Max" />
        <Input label="Search" name="search" value={filters.search} onChange={handleChange} placeholder="Search..." />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading transactions…</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-500">
          No transactions found
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-[1000px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Scheme</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Purpose</th>
                <th className="px-4 py-3 text-left">Executor</th>
                <th className="px-4 py-3 text-left">Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{formatDate(tx.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{tx.schemeName}</div>
                    <div className="text-gray-500">ID: {tx.schemeId}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-600">
                    {tx.purpose}
                  </td>
                  <td className="px-4 py-3 text-sm">{shorten(tx.executor)}</td>
                  <td className="px-4 py-3 text-sm">
                    {getExplorerUrl(tx.txHash) ? (
                      <a
                        href={getExplorerUrl(tx.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {shorten(tx.txHash)}
                      </a>
                    ) : (
                      <span className="text-gray-400">
                        {shorten(tx.txHash)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ===== REUSABLE INPUTS ===== */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
    >
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default PublicTransactionHistory;
