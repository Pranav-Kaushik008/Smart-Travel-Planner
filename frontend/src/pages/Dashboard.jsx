import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import StatsCard from "../components/StatsCard";
import { FaPlane, FaMapMarkedAlt, FaWallet, FaChartBar, FaPlus } from "react-icons/fa";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/dashboard/analytics");
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
        setError("Could not load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Analyzing your travel history..." />;

  if (error || !analytics) {
    return (
      <div className="p-6 text-center max-w-lg mx-auto mt-20 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm font-semibold text-rose-500">{error || "Failed to load dashboard"}</p>
        <RouterLink to="/planner" className="mt-4 inline-flex px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold">
          Plan Your First Trip
        </RouterLink>
      </div>
    );
  }

  // Handle empty state gracefully
  if (analytics.total_trips === 0) {
    return (
      <div className="p-8 md:p-16 text-center max-w-2xl mx-auto mt-16 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaPlane className="w-8 h-8 text-sky-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No Trips Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          Welcome to your new travel planner dashboard! Start by generating a personalized AI vacation recommendation.
        </p>
        <RouterLink
          to="/planner"
          className="inline-flex items-center space-x-2 px-5 py-3 text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-2xl transition-all shadow-md shadow-sky-500/20"
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>Plan a New Trip</span>
        </RouterLink>
      </div>
    );
  }

  // Colors for charts
  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
            Dashboard Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time travel statistics and budget analytics.
          </p>
        </div>
        <RouterLink
          to="/planner"
          className="inline-flex items-center space-x-2 px-4.5 py-2.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md shadow-sky-500/10"
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>New Trip Plan</span>
        </RouterLink>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Trips"
          value={analytics.total_trips}
          icon={<FaPlane className="w-5 h-5" />}
          description="Itineraries generated and saved"
        />
        <StatsCard
          title="Popular Destination"
          value={analytics.most_popular_destination}
          icon={<FaMapMarkedAlt className="w-5 h-5" />}
          description="Your most-predicted location"
        />
        <StatsCard
          title="Average Budget"
          value={`₹${analytics.average_budget.toLocaleString()}`}
          icon={<FaWallet className="w-5 h-5" />}
          description="Average cost per planned trip"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-96">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider">
            Trips Created Over Time
          </h3>
          <div className="flex-1 w-full text-xs">
            {analytics.trips_over_time.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.trips_over_time}>
                  <XAxis dataKey="month" stroke="#839aba" />
                  <YAxis allowDecimals={false} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff"
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#colorUv)" radius={[6, 6, 0, 0]}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No monthly data available
              </div>
            )}
          </div>
        </div>

        {/* Budget Allocation Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-96">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider">
            Accumulated Expense Distribution
          </h3>
          <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-center text-xs">
            {analytics.budget_breakdown.some(b => b.amount > 0) ? (
              <>
                <div className="w-full sm:w-1/2 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.budget_breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {analytics.budget_breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `₹${value.toLocaleString()}`}
                        contentStyle={{ 
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff"
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 space-y-3 mt-4 sm:mt-0 pl-0 sm:pl-8">
                  {analytics.budget_breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="font-semibold text-slate-600 dark:text-slate-450">{item.category}</span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No expense data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Recommended Cities List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider">
          Top Destinations Predicted
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {analytics.popular_destinations.map((dest, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-5 bg-slate-500/5 dark:bg-white/5 border border-slate-200/10 hover:border-slate-200/30 rounded-2xl text-center"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-3"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              >
                {index + 1}
              </div>
              <span className="font-bold text-sm text-slate-800 dark:text-white">{dest.destination}</span>
              <span className="text-xs text-slate-500 mt-1">{dest.count} {dest.count === 1 ? 'trip' : 'trips'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
