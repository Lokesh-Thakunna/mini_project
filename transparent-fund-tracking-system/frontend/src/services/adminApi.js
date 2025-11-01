import axios from "axios";

const API_BASE = "http://localhost:5000/api/admin";

export async function fetchAdminStats() {
  const res = await axios.get(`${API_BASE}/stats`);
  return res.data;
}

export async function fetchSchemes() {
  const res = await axios.get(`${API_BASE}/schemes`);
  return res.data;
}

export async function addScheme(name, amount) {
  const res = await axios.post(`${API_BASE}/add-scheme`, { name, amount });
  return res.data;
}

export async function useFund(schemeId, amount, executor, purpose) {
  const res = await axios.post(`${API_BASE}/use-fund`, { schemeId, amount, executor, purpose });
  return res.data;
}

export async function fetchRecentActivities() {
  // recentActivities is included in stats response
  const stats = await fetchAdminStats();
  return stats.recentActivities || [];
}
