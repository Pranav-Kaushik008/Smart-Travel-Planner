import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaUser, FaEnvelope, FaCalendarCheck, FaUserEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setFullName(user.full_name || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/analytics");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats for profile", err);
      }
    };
    fetchStats();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setSubmitting(true);
    try {
      await api.put("/profile", {
        email,
        full_name: fullName
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Could not update details. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return <LoadingSpinner size="lg" text="Fetching user details..." />;

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">My Profile</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-4">
            {(user.full_name || user.username).substring(0, 1).toUpperCase()}
          </div>
          <h3 className="font-bold text-lg text-slate-850 dark:text-white">
            {user.full_name || user.username}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            @{user.username}
          </p>
          <span className="mt-4 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 dark:text-sky-400">
            Active Explorer
          </span>

          <div className="w-full border-t border-slate-200 dark:border-slate-800 my-6" />

          <div className="space-y-4 w-full text-left text-xs font-semibold">
            <div className="flex justify-between items-center text-slate-500">
              <span>Member Since:</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">{joinedDate}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Saved Trips:</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">{stats?.total_trips || 0} Trips</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Favorite Spot:</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">{stats?.most_popular_destination || "None"}</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center">
              <FaUserEdit className="mr-2 text-sky-500" /> Update Account Settings
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1.5 pl-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <FaUser className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-indigo-500/20 disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
