import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePublicAuth } from "../../context/PublicAuthContext";

const PublicSignUp = () => {
  const navigate = useNavigate();
  const { register } = usePublicAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.fullName) {
      setMessage({ type: "error", text: "Please fill all required fields!" });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long!",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        organization: "Public User",
        phone: formData.phone,
        address: formData.address,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "✅ Account created successfully! Redirecting...",
        });
        setTimeout(() => {
          navigate("/public/schemes", { replace: true });
        }, 1200);
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          error.message ||
          "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">
            Create Public Account
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Sign up to submit grievances and track status
          </p>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div
            className={`mt-4 p-3 rounded text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-400"
                : "bg-red-100 text-red-800 border border-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
          />

          <Textarea
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your address"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Minimum 6 characters"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Re-enter password"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/public/signin"
              className="font-semibold text-purple-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

/* ===== SMALL REUSABLE COMPONENTS ===== */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      {...props}
      rows="3"
      className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);

export default PublicSignUp;
