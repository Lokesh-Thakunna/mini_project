import React, { useState, useEffect } from "react";
import { submitUtilizationRequest } from "../../services/utilizationApi";
import { fetchSchemes } from "../../services/adminApi";
import { useUtilizationAuth } from "../../context/UtilizationAuthContext";

const FundUtilizationRequestForm = () => {
  const { user } = useUtilizationAuth();

  const [formData, setFormData] = useState({
    schemeId: "",
    amount: "",
    purpose: "",
    description: "",
  });

  const [documents, setDocuments] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* ================= LOAD SCHEMES ================= */
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const data = await fetchSchemes();
        setSchemes(data);
      } catch (err) {
        setMessage({ type: "error", text: "❌ Failed to load schemes" });
      }
    };
    loadSchemes();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setDocuments(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.schemeId || !formData.amount || !formData.purpose) {
      setMessage({ type: "error", text: "⚠ Please fill all required fields" });
      return;
    }

    if (Number(formData.amount) <= 0) {
      setMessage({ type: "error", text: "⚠ Enter a valid amount" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const submitData = new FormData();
      submitData.append("schemeId", formData.schemeId);
      submitData.append("amount", formData.amount);
      submitData.append("purpose", formData.purpose);
      submitData.append("description", formData.description || "");

      documents.forEach((file) =>
        submitData.append("documents", file)
      );

      const result = await submitUtilizationRequest(submitData);

      setMessage({
        type: "success",
        text: `✅ Request submitted successfully!\nRequest ID: ${result.request?.requestId}`,
      });

      setFormData({
        schemeId: "",
        amount: "",
        purpose: "",
        description: "",
      });
      setDocuments([]);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          error.message ||
          "❌ Submission failed",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto px-4 pb-12 space-y-6">
      {/* HEADER */}
      <h2 className="text-3xl font-bold text-green-700">
        Fund Utilization Request
      </h2>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`p-4 rounded-lg text-sm whitespace-pre-wrap border ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border-green-400"
              : "bg-red-100 text-red-800 border-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg space-y-6 border"
      >
        {/* SCHEME */}
        <InputSelect
          label="Select Scheme *"
          name="schemeId"
          value={formData.schemeId}
          onChange={handleChange}
          options={[
            { value: "", label: "-- Select Government Scheme --" },
            ...schemes.map((s) => ({
              value: s.id,
              label: `${s.name} | Available ₹${(
                s.totalFunds - s.usedFunds
              ).toLocaleString()}`,
            })),
          ]}
        />

        {/* AGENCY INFO */}
        {user && (
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
            <p className="text-sm">
              <strong>Requesting Agency:</strong> {user.organization}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Automatically fetched from your account
            </p>
          </div>
        )}

        {/* AMOUNT */}
        <Input
          label="Requested Amount (₹) *"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="e.g. 250000"
        />

        {/* PURPOSE */}
        <Input
          label="Purpose of Utilization *"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="e.g. Infrastructure development"
        />

        {/* DESCRIPTION */}
        <Textarea
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Explain how funds will be used"
        />

        {/* DOCUMENTS */}
        <div>
          <label className="label">Supporting Documents</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-green-600 file:text-white
              hover:file:bg-green-700"
          />
          {documents.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {documents.length} document(s) selected
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-green-600 text-white text-lg font-semibold
            hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <input {...props} className="input" required />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <textarea {...props} rows="3" className="input" />
  </div>
);

const InputSelect = ({ label, options, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <select {...props} className="input" required>
      {options.map((o, i) => (
        <option key={i} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default FundUtilizationRequestForm;
