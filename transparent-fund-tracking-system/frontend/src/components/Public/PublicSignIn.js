import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePublicAuth } from "../../context/PublicAuthContext";

const PublicSignIn = () => {
  const navigate = useNavigate();
  const { login } = usePublicAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        setMessage({
          type: "success",
          text: "✅ Sign in successful! Redirecting...",
        });
        setTimeout(() => {
          navigate("/public/schemes", { replace: true });
        }, 1000);
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          error.message ||
          "Sign in failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">
            Public Portal Sign In
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Access grievance reports and track status
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
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="example@email.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/public/signup"
              className="font-semibold text-purple-600 hover:underline"
            >
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default PublicSignIn;
