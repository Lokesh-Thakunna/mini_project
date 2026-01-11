import React, { useEffect, useState, useCallback } from "react";
import { fetchGrievances } from "../../services/publicApi";
import { usePublicAuth } from "../../context/PublicAuthContext";

const MyGrievances = () => {
  const { user } = usePublicAuth();

  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: "" });

  const fetchGrievancesData = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await fetchGrievances({
        submittedBy: user.email,
        ...filters,
      });
      setGrievances(data);
      setError("");
    } catch {
      setError("Failed to load your grievances. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchGrievancesData();
  }, [fetchGrievancesData]);

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      "under-review": "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const downloadFile = (path) => {
    const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;
    window.open(`${apiUrl}/${path}`, "_blank");
  };

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-600">
        Please sign in to view your grievances.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Grievance Reports
        </h2>
        <button
          onClick={fetchGrievancesData}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition self-start sm:self-auto"
        >
          🔄 Refresh
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Filter by Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="w-full sm:w-64 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="under-review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading grievances...</p>
        </div>
      ) : grievances.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-600">No grievances found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-[900px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Scheme</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((g) => (
                <tr key={g._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">
                    {g.grievanceId}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">{g.title}</td>
                  <td className="px-4 py-3 text-sm">
                    {g.schemeName || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm">{g.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        g.status
                      )}`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(g.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedGrievance(g);
                        setShowModal(true);
                      }}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Grievance Details</h3>
              <button onClick={() => setShowModal(false)} className="text-xl">
                ×
              </button>
            </div>

            <pre className="text-sm whitespace-pre-wrap">
{JSON.stringify(selectedGrievance, null, 2)}
            </pre>

            {selectedGrievance.supportingDocuments?.map((doc, i) => (
              <button
                key={i}
                onClick={() => downloadFile(doc.filePath)}
                className="block mt-2 text-purple-600 underline text-sm"
              >
                📄 {doc.fileName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGrievances;
