import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getAccentTheme } from "../utils/themeUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FaPlane, FaUsers, FaWallet, FaCalendarAlt, FaPlus,
  FaMapMarkerAlt, FaFire, FaChartPie, FaCompass, FaStar,
  FaShieldAlt, FaRoute, FaChartBar, FaUserFriends, FaGlobe, FaClock,
  FaChevronDown, FaInfoCircle, FaThLarge, FaChartArea
} from "react-icons/fa";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, Cell, PieChart, Pie
} from "recharts";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#06b6d4"];
const DEST_GRADIENTS = [
  "from-sky-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-pink-600",
  "from-rose-500 to-red-600",
];

const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const target = parseFloat(value) || 0;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const iv = setInterval(() => {
      current = Math.min(current + increment, target);
      setDisplay(current);
      if (current >= target) clearInterval(iv);
    }, 1200 / steps);
    return () => clearInterval(iv);
  }, [value]);
  const formatted = decimals > 0
    ? display.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(display).toLocaleString("en-IN");
  if (typeof value === "string" && isNaN(Number(value))) return <span>{value}</span>;
  return <span>{prefix}{formatted}{suffix}</span>;
};

const KpiCard = ({ title, value, prefix = "", suffix = "", icon, gradient, description, badge, decimals = 0 }) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl ${gradient}`} style={{ minHeight: 155 }}>
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl pointer-events-none" />
    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-white/70 mb-1">{title}</p>
        <h3 className="text-3xl font-black mt-1 leading-none">
          {typeof value === "number"
            ? <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
            : <span>{value}</span>}
        </h3>
        {description && <p className="text-xs text-white/70 mt-2 font-medium">{description}</p>}
      </div>
      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
        <div className="text-xl">{icon}</div>
      </div>
    </div>
    {badge && (
      <div className="relative z-10 mt-4 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl bg-white/25 border border-white/30">
        {badge}
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950/95 border border-slate-700/80 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md min-w-[140px]">
      {label && <p className="text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-xs font-bold text-slate-200">{p.name}:</span>
          <span className="text-xs font-black text-sky-400">
            {typeof p.value === "number" ? `₹${p.value.toLocaleString("en-IN")}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const SectionHeader = ({ icon, title, subtitle, badge }) => (
  <div className="flex items-start justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-4 mb-5">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center text-base shrink-0">{icon}</div>
      <div>
        <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {badge && (
      <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 px-3 py-1.5 rounded-xl border border-sky-500/20">{badge}</span>
    )}
  </div>
);

// ─── Multi-Style Trips Over Time Component ────────────────────────────────────
const MultiStyleTripsOverTime = ({ tripsOverTime = [], rawTripDates = [], totalTrips = 0 }) => {
  const [chartStyle, setChartStyle] = useState("wave");

  const areaData = tripsOverTime.map(t => ({ month: t.month, "Trip Plans": t.count }));

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm transition-all duration-300">
      
      {/* Top Header with Style Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-4 mb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center text-base shrink-0">
            <FaCalendarAlt />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight">
              Trips Over Time
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              Activity timeline and trip planning frequency
            </p>
          </div>
        </div>

        {/* Style Selector Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700">
          <button
            onClick={() => setChartStyle("wave")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all ${
              chartStyle === "wave"
                ? "bg-white dark:bg-slate-700 text-sky-500 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <FaChartArea className="text-xs" /> Gradient Wave
          </button>
          <button
            onClick={() => setChartStyle("bar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all ${
              chartStyle === "bar"
                ? "bg-white dark:bg-slate-700 text-emerald-500 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <FaChartBar className="text-xs" /> Bar Spectrum
          </button>
          <button
            onClick={() => setChartStyle("heatmap")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all ${
              chartStyle === "heatmap"
                ? "bg-white dark:bg-slate-700 text-purple-500 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <FaThLarge className="text-xs" /> Activity Grid
          </button>
        </div>
      </div>

      {/* STYLE 1: Smooth Gradient Wave Area Chart */}
      {chartStyle === "wave" && (
        <div className="animate-fade-in">
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={areaData} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Trip Plans"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fill="url(#waveGrad)"
                  dot={{ r: 5, fill: "#0ea5e9", strokeWidth: 2.5, stroke: "#fff" }}
                  activeDot={{ r: 8, fill: "#6366f1", strokeWidth: 3, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-600">
              <FaCalendarAlt className="text-4xl mb-3" />
              <p className="text-xs font-bold">No activity timeline recorded yet</p>
            </div>
          )}
        </div>
      )}

      {/* STYLE 2: Glassmorphic Bar Spectrum Chart */}
      {chartStyle === "bar" && (
        <div className="animate-fade-in">
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={areaData} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Trip Plans" radius={[10, 10, 0, 0]}>
                  {areaData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <FaChartBar className="text-4xl mb-3" />
              <p className="text-xs font-bold">No activity timeline recorded yet</p>
            </div>
          )}
        </div>
      )}

      {/* STYLE 3: Activity Heatmap Grid */}
      {chartStyle === "heatmap" && (
        <div className="animate-fade-in bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-300">{totalTrips} Total Trip Plans</span>
            <span className="text-[10px] font-semibold text-slate-400">Last 52 Weeks</span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center py-4">
            {tripsOverTime.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 min-w-[75px]"
              >
                <span className="text-[10px] font-extrabold text-slate-400">{item.month}</span>
                <span className="text-lg font-black text-emerald-400 mt-1">{item.count}</span>
                <span className="text-[9px] text-slate-400">trips</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// ─── Donut Chart Component with Legend (Shared for Solo & Group) ──────────────
const DonutWithLegend = ({ data = [], accentColorName = "sky" }) => {
  const total = data.reduce((s, b) => s + b.amount, 0);
  if (total === 0) return (
    <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-600">
      <FaChartPie className="text-4xl mb-2" />
      <p className="text-xs font-bold">No budget data available</p>
    </div>
  );
  const filtered = data.filter(b => b.amount > 0);
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="w-full sm:w-52 h-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={filtered} cx="50%" cy="50%" innerRadius={52} outerRadius={75} paddingAngle={3} dataKey="amount" nameKey="category">
              {filtered.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0];
              return (
                <div className="bg-slate-950/95 border border-slate-700 px-3 py-2 rounded-xl shadow-2xl text-xs">
                  <p className="font-bold text-slate-200">{d.name}</p>
                  <p className="font-black text-emerald-400">₹{Number(d.value).toLocaleString("en-IN")}</p>
                </div>
              );
            }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2 w-full">
        {filtered.map((item, idx) => {
          const pct = Math.round((item.amount / total) * 100);
          return (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{item.category}</span>
                  <span className="text-[11px] font-black text-slate-800 dark:text-white">₹{item.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 w-7 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const { accentColor } = useTheme();
  const accentTheme = getAccentTheme(accentColor);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    api.get("/dashboard/analytics")
      .then(res => setAnalytics(res.data))
      .catch(err => { console.error(err); setError("Could not load dashboard"); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Analyzing your travel story..." />;

  if (error || !analytics) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto mt-24 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
        <FaGlobe className="text-5xl text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <p className="text-sm font-bold text-rose-500 mb-6">{error || "Failed to load dashboard"}</p>
        <RouterLink to="/planner" className="px-5 py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/30">Plan Your First Trip</RouterLink>
      </div>
    );
  }

  const hasIndividual = analytics.total_trips > 0;
  const hasGroup = analytics.total_group_trips > 0;

  if (!hasIndividual && !hasGroup) {
    return (
      <div className="p-8 md:p-16 text-center max-w-2xl mx-auto mt-16 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaPlane className="text-3xl text-sky-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No Trips Yet</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Your dashboard is ready. Start your first AI-powered trip!</p>
        <RouterLink to="/planner" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl shadow-xl shadow-sky-500/30">
          <FaPlus /> Plan a New Trip
        </RouterLink>
      </div>
    );
  }

  const totalAllTrips = analytics.total_trips + (analytics.total_group_trips || 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaChartBar /> },
    ...(hasIndividual ? [{ id: "individual", label: "Solo Trips", icon: <FaPlane /> }] : []),
    ...(hasGroup ? [{ id: "group", label: "Group Trips", icon: <FaUsers /> }] : []),
  ];

  return (
    <div className="p-5 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Travel Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-bold text-sky-500">{user?.full_name || user?.username}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RouterLink to="/planner" className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 rounded-xl transition-all shadow-lg shadow-sky-500/25">
            <FaPlus /> New Trip
          </RouterLink>
          <RouterLink to="/history" className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200 dark:border-slate-700">
            <FaRoute /> History
          </RouterLink>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-md border border-slate-200/50 dark:border-slate-600"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KpiCard title="Total Trips" value={totalAllTrips} icon={<FaPlane />} gradient="bg-gradient-to-br from-sky-500 to-indigo-600"
              description={`${analytics.total_trips} solo · ${analytics.total_group_trips || 0} group`}
              badge={<><FaStar className="text-[9px]" />All Time</>} />
            <KpiCard title="Group Travelers" value={analytics.total_group_travelers || 0} icon={<FaUsers />} gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              description={`Avg ${analytics.avg_group_size || 0} per group trip`}
              badge={<><FaUserFriends className="text-[9px]" />Travelers</>} />
            <KpiCard title="Solo Avg Budget" value={analytics.average_budget} prefix="₹" icon={<FaWallet />} gradient="bg-gradient-to-br from-amber-500 to-orange-600"
              description="Per individual trip"
              badge={<><FaChartPie className="text-[9px]" />Estimated</>} />
            <KpiCard title="Group Total Budget" value={analytics.total_group_budget || 0} prefix="₹" icon={<FaShieldAlt />} gradient="bg-gradient-to-br from-purple-500 to-pink-600"
              description="All group plans combined"
              badge={<><FaFire className="text-[9px]" />All Groups</>} />
          </div>

          {/* Multi-Style Trips Over Time Section */}
          <MultiStyleTripsOverTime tripsOverTime={analytics.trips_over_time || []} rawTripDates={analytics.trip_dates || []} totalTrips={totalAllTrips} />

          {/* Side-By-Side Budget Distribution Cards (Solo & Group Donut Charts) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Solo Budget Distribution */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <SectionHeader icon={<FaChartPie />} title="Solo Budget Distribution" subtitle="Estimated spend across categories" />
              <DonutWithLegend data={analytics.budget_breakdown || []} />
            </div>

            {/* Group Budget Distribution (Same Donut Style!) */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <SectionHeader icon={<FaUsers />} title="Group Budget Distribution" subtitle="Allocated group expense split" />
              <DonutWithLegend data={analytics.group_budget_breakdown || []} />
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
            <SectionHeader icon={<FaMapMarkerAlt />} title="Top Destinations" subtitle="Most planned solo cities" />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {analytics.popular_destinations.length > 0 ? analytics.popular_destinations.slice(0, 5).map((dest, i) => (
                <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/50 hover:border-sky-500/30 transition-all text-center group">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${DEST_GRADIENTS[i % DEST_GRADIENTS.length]} flex items-center justify-center text-white font-black text-xs mb-1.5 shadow-md group-hover:scale-105 transition-transform`}>{i + 1}</div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-tight truncate w-full">{dest.destination}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{dest.count} {dest.count === 1 ? "trip" : "trips"}</p>
                </div>
              )) : <p className="text-xs text-slate-400 text-center py-4 col-span-5">No destinations logged</p>}
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL TAB */}
      {activeTab === "individual" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KpiCard title="Solo Trips" value={analytics.total_trips} icon={<FaPlane />} gradient="bg-gradient-to-br from-sky-500 to-indigo-600" description="Total itineraries" />
            <KpiCard title="Top Destination" value={analytics.most_popular_destination} icon={<FaMapMarkerAlt />} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" description="Most planned city" />
            <KpiCard title="Avg. Budget" value={analytics.average_budget} prefix="₹" icon={<FaWallet />} gradient="bg-gradient-to-br from-amber-500 to-orange-600" description="Per trip estimated" />
            <KpiCard title="Avg. Duration" value={analytics.average_days} suffix=" days" icon={<FaClock />} gradient="bg-gradient-to-br from-purple-500 to-pink-600" description="Per trip" decimals={1} />
          </div>

          <MultiStyleTripsOverTime tripsOverTime={analytics.trips_over_time || []} rawTripDates={analytics.trip_dates || []} totalTrips={analytics.total_trips} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <SectionHeader icon={<FaCompass />} title="Top Destinations" subtitle="Most planned solo locations" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {analytics.popular_destinations.map((dest, i) => (
                  <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/50 hover:border-sky-500/30 transition-all text-center group">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${DEST_GRADIENTS[i % DEST_GRADIENTS.length]} flex items-center justify-center text-white font-black text-sm mb-2 shadow-md group-hover:scale-105 transition-transform`}>{i + 1}</div>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-tight">{dest.destination}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{dest.count} {dest.count === 1 ? "trip" : "trips"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <SectionHeader icon={<FaChartPie />} title="Solo Budget Distribution" subtitle="Estimated spend across categories" />
              <DonutWithLegend data={analytics.budget_breakdown || []} />
            </div>
          </div>
        </div>
      )}

      {/* GROUP TAB */}
      {activeTab === "group" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KpiCard title="Group Trips" value={analytics.total_group_trips || 0} icon={<FaUsers />} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" description="Group itineraries planned" />
            <KpiCard title="Total Travelers" value={analytics.total_group_travelers || 0} icon={<FaUserFriends />} gradient="bg-gradient-to-br from-sky-500 to-indigo-600" description="Across all group trips" />
            <KpiCard title="Avg. Group Size" value={analytics.avg_group_size || 0} suffix=" people" icon={<FaCompass />} gradient="bg-gradient-to-br from-amber-500 to-orange-600" description="Per group trip" decimals={1} />
            <KpiCard title="Total Group Budget" value={analytics.total_group_budget || 0} prefix="₹" icon={<FaShieldAlt />} gradient="bg-gradient-to-br from-purple-500 to-pink-600" description="Combined all plans" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <SectionHeader icon={<FaGlobe />} title="Group Destinations" subtitle="Where your groups have gone" />
              {(analytics.group_destinations || []).length > 0 ? (
                <div className="space-y-3">
                  {analytics.group_destinations.map((dest, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${DEST_GRADIENTS[i % DEST_GRADIENTS.length]} flex items-center justify-center text-white text-xs font-black shadow-md shrink-0`}>{i + 1}</div>
                      <div className="flex-1">
                        <p className="text-xs font-extrabold text-slate-800 dark:text-white">{dest.destination}</p>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.round((dest.count / (analytics.total_group_trips || 1)) * 100)}%`, backgroundColor: COLORS[i % COLORS.length], transition: "width 0.7s ease" }} />
                        </div>
                      </div>
                      <span className="text-[11px] font-black text-slate-800 dark:text-white shrink-0">{dest.count} {dest.count === 1 ? "trip" : "trips"}</span>
                      {i === 0 && <FaFire className="text-amber-400 text-sm shrink-0" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400"><FaGlobe className="text-4xl mb-2" /><p className="text-xs font-bold">No destinations yet</p></div>
              )}
            </div>

            {/* Group Budget Distribution using exact Donut Chart format */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <SectionHeader icon={<FaChartPie />} title="Group Budget Distribution" subtitle="Allocated group expense split" />
              <DonutWithLegend data={analytics.group_budget_breakdown || []} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black mb-2">Plan Your Next Group Adventure</h3>
                <p className="text-sm text-white/80 max-w-md">AI-powered itineraries, smart budget splitting, member management — all in one place.</p>
              </div>
              <RouterLink to="/planner" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-extrabold text-sm rounded-2xl hover:bg-white/90 transition-all shadow-xl">
                <FaUsers /> Plan Group Trip
              </RouterLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
