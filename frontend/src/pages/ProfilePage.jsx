import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCalendarAlt,
  FaGlobe,
  FaHeart,
  FaPassport,
  FaSuitcase,
  FaCamera,
  FaPen,
  FaChartPie,
  FaCompass,
  FaHotel
} from "react-icons/fa";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip as ChartTooltip, Cell } from "recharts";
import toast from "react-hot-toast";

const MAX_BIO = 300;

// Random beautiful cover images matching travel themes
const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80", // Road trip
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80", // Map/Traveler
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", // Tropical beach
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80"  // Snowy peaks
];

// Profile cover selection
const coverUrl = COVER_IMAGES[1]; // default vintage travel map cover

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    dob: "",
    bio: "",
    interests: [],
    favorite_destinations: [],
    languages: [],
    travel_style: "Boutique", // Boutique, Luxury, Backpacker, Adventure
    preferred_season: "All"   // Summer, Winter, Monsoon, All
  });

  const [edited, setEdited] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    // Load local storage extras as fallback, but prefer backend fields
    const localExtra = JSON.parse(localStorage.getItem("profile_extra") || "null") || {};
    
    setProfile({
      full_name: user.full_name || user.username || "",
      email: user.email || "",
      phone: user.phone || localExtra.phone || "",
      location: user.location || localExtra.location || "",
      dob: user.dob || localExtra.dob || "",
      bio: user.bio || localExtra.bio || "",
      interests: user.interests || localExtra.interests || [],
      favorite_destinations: user.favorite_destinations || localExtra.favorite_destinations || [],
      languages: user.languages || localExtra.languages || [],
      travel_style: user.travel_style || localExtra.travel_style || "Boutique",
      preferred_season: user.preferred_season || localExtra.preferred_season || "All"
    });
    
    setLoading(false);
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

  const handleChange = (key, value) => {
    setEdited((s) => ({ ...(s || profile), [key]: value }));
  };

  const startEdit = (tabName = "edit-profile") => {
    setEdited({ ...profile });
    setActiveTab(tabName);
  };

  const cancelEdit = () => {
    setEdited(null);
    setActiveTab("overview");
  };

  const handleAddTag = (field, value) => {
    if (!value) return;
    setEdited((s) => {
      const current = s || profile;
      const arr = Array.isArray(current[field]) ? [...current[field]] : [];
      if (!arr.includes(value)) arr.push(value);
      return { ...current, [field]: arr };
    });
  };

  const handleRemoveTag = (field, idx) => {
    setEdited((s) => {
      const current = s || profile;
      const updated = current[field].filter((_, i) => i !== idx);
      return { ...current, [field]: updated };
    });
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const activeData = edited || profile;

    setSubmitting(true);
    try {
      const payload = {
        full_name: activeData.full_name,
        email: activeData.email,
        phone: activeData.phone,
        location: activeData.location,
        dob: activeData.dob,
        bio: activeData.bio,
        interests: activeData.interests,
        favorite_destinations: activeData.favorite_destinations,
        languages: activeData.languages,
        travel_style: activeData.travel_style,
        preferred_season: activeData.preferred_season
      };

      // Call backend to persist user details
      const res = await api.put("/profile", payload);
      const serverUser = res.data;

      // Sync to local storage for backwards compatibility
      localStorage.setItem("profile_extra", JSON.stringify({
        phone: payload.phone,
        location: payload.location,
        dob: payload.dob,
        bio: payload.bio,
        interests: payload.interests,
        favorite_destinations: payload.favorite_destinations,
        languages: payload.languages,
        travel_style: payload.travel_style,
        preferred_season: payload.preferred_season
      }));

      setProfile({
        ...profile,
        ...serverUser,
        phone: serverUser.phone || payload.phone,
        location: serverUser.location || payload.location,
        dob: serverUser.dob || payload.dob,
        bio: serverUser.bio || payload.bio,
        interests: serverUser.interests || payload.interests,
        favorite_destinations: serverUser.favorite_destinations || payload.favorite_destinations,
        languages: serverUser.languages || payload.languages
      });

      setEdited(null);
      setActiveTab("overview");
      toast.success("Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile", err);
      toast.error("Failed to save profile. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Determine traveler archetype badge
  const getTravelerArchetype = () => {
    const interests = profile.interests || [];
    const lowerInterests = interests.map(i => i.toLowerCase());
    
    if (lowerInterests.some(i => i.includes("trek") || i.includes("hike") || i.includes("climb") || i.includes("camp"))) {
      return { title: "Wilderness Explorer", icon: "⛰️", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/35" };
    }
    if (lowerInterests.some(i => i.includes("beach") || i.includes("surf") || i.includes("swim") || i.includes("island"))) {
      return { title: "Sun-Seeker", icon: "🏝️", color: "bg-sky-500/10 text-sky-500 border-sky-500/35" };
    }
    if (lowerInterests.some(i => i.includes("history") || i.includes("museum") || i.includes("art") || i.includes("culture"))) {
      return { title: "Heritage Historian", icon: "🏛️", color: "bg-amber-500/10 text-amber-500 border-amber-500/35" };
    }
    return { title: "Global Nomad", icon: "🌍", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/35" };
  };

  const archetype = getTravelerArchetype();

  if (authLoading || loading) return <LoadingSpinner size="lg" text="Loading profile..." />;

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Unknown";

  // Prepare stats data for Chart
  const COLOR_MAP = {
    Hotel: "#0ea5e9",
    Food: "#10b981",
    Travel: "#f59e0b",
    Activity: "#8b5cf6",
    Activities: "#8b5cf6",
    Miscellaneous: "#f43f5e"
  };

  const budgetChartData = (stats?.budget_breakdown || []).map(item => ({
    name: item.category,
    value: item.amount,
    color: COLOR_MAP[item.category] || "#6366f1"
  }));

  const totalBudgetEstimated = (stats?.budget_breakdown || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalActualSpent = stats?.total_actual_spent || 0;

  const actualChartData = (stats?.actual_breakdown || []).map(item => ({
    name: item.category,
    value: item.amount,
    color: COLOR_MAP[item.category] || "#6366f1"
  }));

  return (
    <div className="profile-page p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Visual Cover & Header Card */}
      <div className="relative rounded-[32px] overflow-hidden border border-slate-200/50 dark:border-slate-800/80 bg-slate-900 shadow-xl">
        <div className="h-44 md:h-64 w-full relative overflow-hidden">
          <img src={coverUrl} alt="Travel Cover" className="w-full h-full object-cover opacity-85 saturate-[0.85]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        </div>
        
        {/* Profile User Info Block */}
        <div className="relative px-6 md:px-10 pb-8 -mt-16 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-extrabold shadow-2xl relative overflow-hidden">
              {(profile.full_name || user.username || "U").substring(0, 1).toUpperCase()}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <FaCamera className="text-white text-xl" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h2 className="text-3xl font-extrabold text-white">{profile.full_name || user.username}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${archetype.color} flex items-center gap-1.5`}>
                <span>{archetype.icon}</span> {archetype.title}
              </span>
            </div>
            <p className="text-sm text-slate-300 font-medium">@{user.username} &bull; Joined {joinedDate}</p>
            {profile.bio && <p className="text-sm text-slate-200 mt-1 max-w-xl italic">"{profile.bio}"</p>}
          </div>

          <div className="flex gap-3">
            {activeTab === "overview" ? (
              <button 
                onClick={() => startEdit("edit-profile")}
                className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold transition-all shadow-md flex items-center gap-2 text-sm"
              >
                <FaPen className="text-xs" /> Edit Profile
              </button>
            ) : (
              <button 
                onClick={cancelEdit}
                className="px-5 py-3 rounded-2xl bg-slate-800/80 text-white hover:bg-slate-700/80 font-bold transition-all flex items-center gap-2 text-sm border border-slate-700"
              >
                Back to Overview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6 overflow-x-auto pb-0.5">
        {[
          { id: "overview", label: "Overview", icon: FaCompass },
          { id: "edit-profile", label: "Edit Profile", icon: FaUser },
          { id: "preferences", label: "Travel Preferences", icon: FaPassport },
          { id: "stats", label: "Travel Insights", icon: FaChartPie }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                if (edited && t.id !== "edit-profile" && t.id !== "preferences") {
                  if (confirm("You have unsaved changes. Discard them?")) {
                    setEdited(null);
                    setActiveTab(t.id);
                  }
                } else {
                  setActiveTab(t.id);
                }
              }}
              className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-all relative ${
                activeTab === t.id
                  ? "border-sky-500 text-sky-500"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="text-base" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tab Contents Main Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 flex items-start gap-4">
                  <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Base</h4>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-1">
                      {profile.location || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <FaPassport className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Travel Archetype</h4>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-1">
                      {archetype.icon} {archetype.title}
                    </p>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                    <FaSuitcase className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accommodation Style</h4>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-1">
                      💼 {profile.travel_style}
                    </p>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                    <FaGlobe className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred Season</h4>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-1">
                      🌤️ {profile.preferred_season}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bucket List / Favorite Destinations */}
              <div className="glass-panel p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FaHeart className="text-rose-500" /> Travel Bucket List
                  </h3>
                  <button onClick={() => startEdit("preferences")} className="text-xs text-sky-500 hover:underline font-bold">Edit</button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {(profile.favorite_destinations || []).length === 0 ? (
                    <p className="text-sm text-slate-400 py-2">No bucket list destinations added yet. Plan your next adventure!</p>
                  ) : (
                    profile.favorite_destinations.map((d, i) => (
                      <span key={i} className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/25 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <span>📍</span> {d}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Profile Bio Details card */}
              <div className="glass-panel p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaUser className="text-indigo-500" /> About Me
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {profile.bio || "No profile bio written yet. Introduce yourself to the travel community!"}
                </p>
              </div>

            </div>
          )}

          {/* TAB: EDIT PROFILE */}
          {(activeTab === "edit-profile" || activeTab === "preferences") && (
            <div className="glass-panel p-7 rounded-[28px] border border-slate-200/50 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 shadow-md">
              <form onSubmit={handleSave} className="space-y-6">
                
                {activeTab === "edit-profile" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
                        <input 
                          value={edited?.full_name ?? profile.full_name} 
                          onChange={(e) => handleChange("full_name", e.target.value)} 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address</label>
                        <input 
                          value={edited?.email ?? profile.email} 
                          onChange={(e) => handleChange("email", e.target.value)} 
                          type="email" 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone Number</label>
                        <input 
                          value={edited?.phone ?? profile.phone} 
                          onChange={(e) => handleChange("phone", e.target.value)} 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Current Location</label>
                        <input 
                          value={edited?.location ?? profile.location} 
                          onChange={(e) => handleChange("location", e.target.value)} 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                          placeholder="e.g. Bangalore, India"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Date of Birth</label>
                        <input 
                          value={edited?.dob ?? profile.dob} 
                          onChange={(e) => handleChange("dob", e.target.value)} 
                          type="date" 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bio / Description</label>
                      <textarea 
                        maxLength={MAX_BIO} 
                        value={edited?.bio ?? profile.bio} 
                        onChange={(e) => handleChange("bio", e.target.value)} 
                        rows={4} 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none min-h-[120px] resize-none"
                        placeholder="Tell other travelers about your adventures, travel goals, or planning style..."
                      />
                      <div className="text-xs text-slate-400 text-right mt-1">{(edited?.bio ?? profile.bio)?.length || 0}/{MAX_BIO}</div>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">Travel Preferences</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Travel & Lodging Style</label>
                        <select
                          value={edited?.travel_style ?? profile.travel_style}
                          onChange={(e) => handleChange("travel_style", e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                        >
                          <option value="Luxury">✨ Luxury & Premium Resorts</option>
                          <option value="Boutique">🏨 Boutique & Charming Hotels</option>
                          <option value="Backpacker">🎒 Backpacker & Budget Hostels</option>
                          <option value="Adventure">🧗 Wilderness Camps & Glamping</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Preferred Travel Season</label>
                        <select
                          value={edited?.preferred_season ?? profile.preferred_season}
                          onChange={(e) => handleChange("preferred_season", e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                        >
                          <option value="Summer">☀️ Summer</option>
                          <option value="Winter">❄️ Winter</option>
                          <option value="Monsoon">🌧️ Monsoon</option>
                          <option value="All">🌍 Year-Round (All Seasons)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Interests / Activities</label>
                      <TagEditor 
                        values={(edited?.interests ?? profile.interests)} 
                        onAdd={(v) => handleAddTag("interests", v)} 
                        onRemove={(i) => handleRemoveTag("interests", i)} 
                        placeholder="e.g. Hiking, Museums, Food Tours, Photography (Press Enter)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Travel Bucket List Destinations</label>
                      <TagEditor 
                        values={(edited?.favorite_destinations ?? profile.favorite_destinations)} 
                        onAdd={(v) => handleAddTag("favorite_destinations", v)} 
                        onRemove={(i) => handleRemoveTag("favorite_destinations", i)} 
                        placeholder="e.g. Bali, Iceland, Kyoto, Paris (Press Enter)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Languages Spoken</label>
                      <TagEditor 
                        values={(edited?.languages ?? profile.languages)} 
                        onAdd={(v) => handleAddTag("languages", v)} 
                        onRemove={(i) => handleRemoveTag("languages", i)} 
                        placeholder="e.g. English, Hindi, Spanish (Press Enter)"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl font-bold text-sm shadow-md hover:from-sky-600 hover:to-indigo-600 disabled:opacity-60 transition-all"
                  >
                    {submitting ? "Saving Changes..." : "Save Profile"}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelEdit} 
                    className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: TRAVEL INSIGHTS */}
          {activeTab === "stats" && (
            <div className="glass-panel p-6 rounded-[28px] border border-slate-200/50 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Your Travel Analytics</h3>
                <p className="text-xs text-slate-500 mt-0.5">Statistical insights aggregated from all your planned and saved trips.</p>
              </div>

              {stats?.total_trips > 0 ? (
                <div className="space-y-6">
                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl text-center">
                      <div className="text-2xl font-black text-sky-500">{stats.total_trips}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Trips Planned</div>
                    </div>
                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center">
                      <div className="text-2xl font-black text-amber-500">₹{totalBudgetEstimated.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Est. Budget</div>
                    </div>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center">
                      <div className="text-2xl font-black text-emerald-500">₹{totalActualSpent.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Actual Spent</div>
                    </div>
                  </div>

                  {/* Estimated Budget Allocation Chart */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Budget Breakdown</h4>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={budgetChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                          <ChartTooltip 
                            formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Estimated"]} 
                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", backgroundColor: "#0f172a", color: "#fff" }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {budgetChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Actual Expense Chart */}
                  {totalActualSpent > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Actual Expenses (User-Reported)</h4>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={actualChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                            <ChartTooltip 
                              formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Actual"]} 
                              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", backgroundColor: "#0f172a", color: "#fff" }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                              {actualChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                    <FaSuitcase className="text-slate-400 text-2xl" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">No Travel Data Found</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Once you generate and save some trips, we'll build interactive visual statistics here.</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar Cards Panel */}
        <div className="space-y-6">
          
          {/* Quick Traveler Stats Card */}
          <div className="glass-panel p-6 rounded-[28px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <FaCompass className="text-indigo-500" /> Travel Log
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold">Total Planned Trips</span>
                <span className="font-extrabold text-sm text-slate-800 dark:text-white">{stats?.total_trips || 0}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold">Estimated Budget</span>
                <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
                  ₹{totalBudgetEstimated.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold">Actual Spent</span>
                <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                  ₹{totalActualSpent.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Frequent Destination</span>
                <span className="font-extrabold text-sm text-slate-800 dark:text-white">
                  {stats?.most_popular_destination || "None yet"}
                </span>
              </div>
            </div>
          </div>

          {/* Languages spoken card */}
          <div className="glass-panel p-6 rounded-[28px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                <FaGlobe className="text-emerald-500" /> Languages
              </h3>
              <button onClick={() => startEdit("preferences")} className="text-xs text-sky-500 hover:underline font-bold">Edit</button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(profile.languages || []).length === 0 ? (
                <span className="text-xs text-slate-400">Add languages you speak</span>
              ) : (
                profile.languages.map((l, i) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/25 rounded-full text-xs font-bold">
                    🗣️ {l}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Travel Interests tags card */}
          <div className="glass-panel p-6 rounded-[28px] border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                <FaHeart className="text-indigo-500" /> Interests
              </h3>
              <button onClick={() => startEdit("preferences")} className="text-xs text-sky-500 hover:underline font-bold">Edit</button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(profile.interests || []).length === 0 ? (
                <span className="text-xs text-slate-400">Add your travel hobbies</span>
              ) : (
                profile.interests.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/25 rounded-full text-xs font-bold">
                    🚀 {t}
                  </span>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

const TagEditor = ({ values = [], onAdd, onRemove, placeholder = "Add and press Enter" }) => {
  const [input, setInput] = useState("");
  
  const flush = () => {
    const val = (input || "").trim();
    if (val) {
      const parts = val.split(",").map((p) => p.trim()).filter(Boolean);
      parts.forEach((p) => onAdd(p));
      setInput("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <span key={i} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <span>{v}</span>
            <button type="button" onClick={() => onRemove(i)} className="text-[10px] text-slate-400 hover:text-rose-500 font-bold ml-1">✕</button>
          </span>
        ))}
      </div>
      <input
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            flush();
          }
        }}
        onBlur={() => flush()}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
      />
    </div>
  );
};

export default ProfilePage;
