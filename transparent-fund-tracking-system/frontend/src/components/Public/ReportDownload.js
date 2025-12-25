import React, { useState } from "react";
import { downloadReport } from "../../services/publicApi";

const ReportDownload = () => {
  const [loading, setLoading] = useState({
    schemes: false,
    transactions: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleDownload = async (type, format) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    setMessage({ type: "", text: "" });

    try {
      const data = await downloadReport(type, format);

      const blob =
        format === "csv"
          ? new Blob([data], { type: "text/csv" })
          : new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}-report-${new Date()
        .toISOString()
        .split("T")[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage({
        type: "success",
        text: `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded successfully!`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          error.message ||
          "Failed to download report",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">
          Download Reports
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Download reports for offline analysis in CSV or JSON format.
        </p>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`p-4 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* REPORT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Schemes */}
        <ReportCard
          title="📊 Schemes Report"
          description="Complete information about all schemes including budgets and utilization."
          loading={loading.schemes}
          onCsv={() => handleDownload("schemes", "csv")}
          onJson={() => handleDownload("schemes", "json")}
        />

        {/* Transactions */}
        <ReportCard
          title="💰 Transactions Report"
          description="Full transaction history with amounts, purpose, and blockchain hashes."
          loading={loading.transactions}
          onCsv={() => handleDownload("transactions", "csv")}
          onJson={() => handleDownload("transactions", "json")}
        />
      </div>

      {/* INFO */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">
          Report Information
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            <strong>CSV:</strong> Works with Excel & Google Sheets
          </li>
          <li>
            <strong>JSON:</strong> Machine-readable format
          </li>
          <li>Reports include all data available at download time</li>
          <li>Large datasets may take a few seconds</li>
        </ul>
      </div>
    </div>
  );
};

/* ===== REUSABLE CARD ===== */

const ReportCard = ({ title, description, loading, onCsv, onJson }) => (
  <div className="bg-white rounded-xl shadow p-5 sm:p-6 flex flex-col">
    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
      {title}
    </h3>
    <p className="text-sm text-gray-600 mb-4">{description}</p>

    <div className="space-y-3 mt-auto">
      <button
        onClick={onCsv}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Downloading..." : "📥 Download CSV"}
      </button>

      <button
        onClick={onJson}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 transition disabled:opacity-50"
      >
        {loading ? "Downloading..." : "📥 Download JSON"}
      </button>
    </div>
  </div>
);

export default ReportDownload;
