import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUtilizationAuth } from "../../context/UtilizationAuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useUtilizationAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    organization: "",
    designation: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.fullName ||
      !formData.organization
    ) {
      setMessage({ type: "error", text: "Please fill all required fields!" });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters!",
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
        organization: formData.organization,
        designation: formData.designation,
        phone: formData.phone,
        address: formData.address,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "✅ Account created successfully! Redirecting...",
        });
        setTimeout(() => {
          navigate("/utilization/requests", { replace: true });
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
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700">
            Create Utilization Account
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Register to submit fund utilization requests
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

          <Input label="Full Name *" name="fullName" value={formData.fullName} onChange={handleChange} />
          <Input label="Email *" type="email" name="email" value={formData.email} onChange={handleChange} />
          <Input label="Organization *" name="organization" value={formData.organization} onChange={handleChange} placeholder="Department / Agency" />
          <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
          <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXXXXX" />

          <Textarea label="Address" name="address" value={formData.address} onChange={handleChange} />

          <Input label="Password *" type="password" name="password" value={formData.password} onChange={handleChange} />
          <Input label="Confirm Password *" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/utilization/signin"
              className="font-semibold text-green-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
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
      required={label.includes("*")}
      className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
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
      rows="2"
      className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
    />
  </div>
);

export default SignUp;
