import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchAdminStats, fetchSchemes, addScheme, useFund } from "../../services/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const s = await fetchAdminStats();
        setStats(s);
      } catch (err) {
        console.error('Failed to load stats', err);
        setStats({ totalSchemes: 0, totalAllocated: 0, totalUsed: 0, recentActivities: [] });
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const res = await fetchSchemes();
        setSchemes(res || []);
      } catch (err) {
        console.error('Failed to load schemes', err);
        setSchemes([]);
      }
    };
    loadSchemes();
  }, []);

  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState(0);

  const handleAddScheme = async (e) => {
    e.preventDefault();
    await addScheme(newName, Number(newAmount));
    const res = await fetchSchemes();
    setSchemes(res);
    const s = await fetchAdminStats();
    setStats(s);
    setNewName(''); setNewAmount(0);
  };

  const [useSchemeId, setUseSchemeId] = useState('');
  const [useAmount, setUseAmount] = useState(0);
  const [executor, setExecutor] = useState('');

  const handleUseFund = async (e) => {
    e.preventDefault();
    await useFund(Number(useSchemeId), Number(useAmount), executor);
    const res = await fetchSchemes();
    setSchemes(res);
    const s = await fetchAdminStats();
    setStats(s);
  };

  if (!stats) return <p className="text-center mt-10">Loading dashboard...</p>;

  const chartData = [
    { name: "Allocated", value: stats.totalAllocated || 0 },
    { name: "Used", value: stats.totalUsed || 0 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500">Total Schemes</h3>
          <p className="text-2xl font-semibold">{stats.totalSchemes}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500">Total Allocated</h3>
          <p className="text-2xl font-semibold">{stats.totalAllocated} ETH</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500">Total Used</h3>
          <p className="text-2xl font-semibold">{stats.totalUsed} ETH</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-4">Fund Utilization</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Add Scheme</h3>
          <form onSubmit={handleAddScheme} className="space-y-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" className="border p-2 w-full rounded" />
            <input value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount (wei/units)" className="border p-2 w-full rounded" type="number" />
            <button className="bg-green-600 text-white p-2 rounded">Add</button>
          </form>
        </div>

        <div className="bg-white p-4 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Use Fund</h3>
          <form onSubmit={handleUseFund} className="space-y-2">
            <select value={useSchemeId} onChange={(e) => setUseSchemeId(e.target.value)} className="border p-2 w-full rounded">
              <option value="">Select scheme</option>
              {schemes.map(s => <option key={s.id} value={s.id}>{s.name} (id: {s.id})</option>)}
            </select>
            <input value={useAmount} onChange={(e) => setUseAmount(e.target.value)} placeholder="Amount" className="border p-2 w-full rounded" type="number" />
            <input value={executor} onChange={(e) => setExecutor(e.target.value)} placeholder="Executor address" className="border p-2 w-full rounded" />
            <button className="bg-red-600 text-white p-2 rounded">Use</button>
          </form>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-4">On-chain Schemes</h3>
        <ul>
          {schemes.map(s => (
            <li key={s.id} className="border-b py-2">
              <strong>{s.name}</strong> — Allocated: {s.totalFunds} — Used: {s.usedFunds}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 shadow rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <ul>
          {(stats.recentActivities?.length || 0) === 0 && (
            <li className="text-gray-500">No recent transactions.</li>
          )}
          {stats.recentActivities?.map((t) => (
            <li key={t._id} className="border-b py-2">
              <strong>{t.type || 'tx'}</strong> — {t.amount} ETH on {new Date(t.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
