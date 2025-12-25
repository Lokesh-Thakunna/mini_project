import React, { useState, useEffect } from "react";
import { submitGrievance, fetchPublicSchemes } from "../../services/publicApi";
import { usePublicAuth } from "../../context/PublicAuthContext";

const GrievanceSubmission = () => {
  const { user } = usePublicAuth();

  const [formData, setFormData] = useState({
    schemeId: "",
    schemeName: "",
    category: "other",
    title: "",
    description: "",
    location: "",
    beneficiaryName: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    submittedBy: user?.email || "anonymous",
  });

  const [documents, setDocuments] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const schemesList = await fetchPublicSchemes();
        setSchemes(schemesList);
      } catch (error) {
        console.error(error);
      }
    };
    loadSchemes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "schemeId" && value) {
      const selectedScheme = schemes.find(
        (s) => s.id === Number(value)
      );
      if (selectedScheme) {
        setFormData((prev) => ({
          ...prev,
          schemeName: selectedScheme.name,
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.title || !formData.description) {
      setMessage({ type: "error", text: "Please fill all required fields!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });
      documents.forEach((file) => submitData.append("documents", file));

      const result = await submitGrievance(submitData);

      setMessage({
        type: "success",
        text: `✅ Grievance submitted successfully!\nGrievance ID: ${result.grievance?.grievanceId}\nStatus: ${result.grievance?.status}`,
      });

      setFormData({
        schemeId: "",
        schemeName: "",
        category: "other",
        title: "",
        description: "",
        location: "",
        beneficiaryName: "",
        contactEmail: "",
        contactPhone: "",
        submittedBy: "anonymous",
      });
      setDocuments([]);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          error.message ||
          "Submission failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-purple-700">
        Submit Grievance
      </h2>

      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Report fund misuse, delays, corruption, or irregularities. Your
        identity will remain confidential.
      </p>

      {message.text && (
        <div
          className={`p-4 mb-4 rounded text-sm whitespace-pre-wrap ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 sm:p-6 rounded-xl shadow-md space-y-5"
      >
        {/* Category & Scheme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="fund-misuse">Fund Misuse</option>
              <option value="irregularity">Irregularity</option>
              <option value="delay">Delay</option>
              <option value="corruption">Corruption</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="label">Scheme (Optional)</label>
            <select
              name="schemeId"
              value={formData.schemeId}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select scheme</option>
              {schemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="label">Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Brief grievance title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">Description *</label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="input"
            placeholder="Detailed explanation..."
            required
          />
        </div>

        {/* Location & Beneficiary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input"
            placeholder="Location"
          />
          <input
            name="beneficiaryName"
            value={formData.beneficiaryName}
            onChange={handleChange}
            className="input"
            placeholder="Beneficiary Name"
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            className="input"
            placeholder="Email"
          />
          <input
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="input"
            placeholder="Phone"
          />
        </div>

        {/* Files */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="input"
        />

        {/* Note */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200 text-sm text-blue-800">
          <strong>Note:</strong> Track your grievance using the provided
          Grievance ID.
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Grievance"}
        </button>
      </form>
    </div>
  );
};

export default GrievanceSubmission;
