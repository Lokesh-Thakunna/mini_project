import React, { useState, useEffect, useCallback } from "react";
import { fetchPublicSchemes } from "../../services/publicApi";

const SchemesView = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    schemeId: "",
    minBudget: "",
    maxBudget: "",
  });

  const loadSchemes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublicSchemes(filters);
      setSchemes(data);
    } catch (error) {
      console.error("Error loading schemes:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "-";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

      {/* HEADER */}
      <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">
        Active Schemes & Budgets
      </h2>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Search"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Scheme name"
        />
        <Input
          label="Scheme ID"
          name="schemeId"
          type="number"
          value={filters.schemeId}
          onChange={handleChange}
          placeholder="ID"
        />
        <Input
          label="Min Budget (₹)"
          name="minBudget"
          type="number"
          value={filters.minBudget}
          onChange={handleChange}
          placeholder="Minimum"
        />
        <Input
          label="Max Budget (₹)"
          name="maxBudget"
          type="number"
          value={filters.maxBudget}
          onChange={handleChange}
          placeholder="Maximum"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading schemes…</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-500">
          No schemes found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition flex flex-col"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {scheme.name}
                </h3>
                <span className="text-xs text-gray-500">
                  ID: {scheme.id}
                </span>
              </div>

              {/* FUNDS */}
              <div className="space-y-3 flex-1">
                <Stat label="Total Budget" value={`₹${scheme.totalFunds.toLocaleString()}`} />
                <Stat label="Used Funds" value={`₹${scheme.usedFunds.toLocaleString()}`} color="text-orange-600" />
                <Stat label="Remaining Funds" value={`₹${scheme.remainingFunds.toLocaleString()}`} color="text-green-600" />

                {/* UTILIZATION */}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Utilization
                  </label>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{scheme.utilizationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${scheme.utilizationPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* ELIGIBILITY */}
                {scheme.eligibilityCriteria && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Eligibility
                    </label>
                    <p className="text-sm text-gray-700 mt-1">
                      {scheme.eligibilityCriteria}
                    </p>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="pt-3 mt-4 border-t text-xs text-gray-400">
                Created: {formatDate(scheme.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== REUSABLE COMPONENTS ===== */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);

const Stat = ({ label, value, color = "text-gray-900" }) => (
  <div>
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <p className={`text-lg font-semibold ${color}`}>{value}</p>
  </div>
);

export default SchemesView;
