import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaEnvelope, FaCompass, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setSubmitting(true);
    const result = await register(username, email, password, fullName);
    setSubmitting(false);

    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      setError(result.error);
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="w-80 h-80 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
        <div className="w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 justify-center mb-4">
            <FaCompass className="h-8 w-8 text-sky-500 animate-spin" />
            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Smart Planner
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Sign up to plan trips and view personalized analytics.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-2 text-xs font-semibold text-rose-600 dark:text-rose-455">
            <FaExclamationCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-1.5 pl-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaUser className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-1.5 pl-1">
              Username *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaUser className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1.5 pl-1">
              Email Address *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaEnvelope className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1.5 pl-1">
              Password *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-indigo-500/20 disabled:opacity-50 mt-6"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-455 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-500 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
