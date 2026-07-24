import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaCog,
  FaBell,
  FaPalette,
  FaShieldAlt,
  FaGlobe,
  FaDatabase,
  FaLock,
  FaCheck,
  FaTrashAlt,
  FaDownload,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaMoon,
  FaSun
} from "react-icons/fa";
import { getAccentTheme } from "../utils/themeUtils";

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [activeTab, setActiveTab] = useState("appearance"); // default to appearance tab as requested
  
  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("user_app_settings");
    return saved
      ? JSON.parse(saved)
      : {
          theme: theme || "dark",
          accentColor: "sky",
          currency: "INR",
          tempUnit: "C",
          emailAlerts: true,
          tripReminders: true,
          weatherAlerts: true,
          marketingEmails: false,
          twoFactor: false,
          publicProfile: true,
          shareAnalytics: true,
          defaultBudgetStyle: "Comfort"
        };
  });

  const accentTheme = getAccentTheme(accentColor || settings.accentColor);

  // Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    setSettings((prev) => ({ ...prev, theme }));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("user_app_settings", JSON.stringify(settings));
  }, [settings]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    toast.success(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} Mode!`);
  };

  const handleAccentChange = (newAccent) => {
    if (setAccentColor) {
      setAccentColor(newAccent);
    }
    setSettings((prev) => ({ ...prev, accentColor: newAccent }));
    toast.success(`Accent theme updated to ${newAccent.charAt(0).toUpperCase() + newAccent.slice(1)}!`);
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success("Setting updated!");
  };

  const handleSelectChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    toast.success("Preference saved!");
  };

  const handleSaveAll = () => {
    localStorage.setItem("user_app_settings", JSON.stringify(settings));
    toast.success("All settings successfully saved!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    toast.success("Password updated successfully!");
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleExportData = () => {
    const exportData = {
      user: { username: user?.username, email: user?.email },
      settings,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `smart_travel_settings_${user?.username || "user"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Data export downloaded!");
  };

  const handleClearCache = () => {
    if (window.confirm("Are you sure you want to clear local trip history cache?")) {
      localStorage.removeItem("profile_extra");
      toast.success("Local cache cleared!");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-sky-500/20">
            <FaCog className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Application Settings
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Customize your preferences, notification rules, security, and interface appearance
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl ${accentTheme.gradient} text-white font-extrabold text-xs sm:text-sm hover:shadow-lg ${accentTheme.shadow} transition-all w-fit`}
        >
          <FaSave />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="glass-panel p-3 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 h-fit space-y-1">
          <button
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "appearance"
                ? accentTheme.activeTab
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FaPalette className="text-base" />
            <span>Appearance & Theme</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "notifications"
                ? accentTheme.activeTab
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FaBell className="text-base" />
            <span>Notifications & Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "security"
                ? accentTheme.activeTab
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FaShieldAlt className="text-base" />
            <span>Security & Privacy</span>
          </button>

          <button
            onClick={() => setActiveTab("data")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "data"
                ? accentTheme.activeTab
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FaDatabase className="text-base" />
            <span>Data & Storage</span>
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-6">

          {/* TAB 2: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Appearance & Visual Styling
              </h3>

              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Interface Theme Mode
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dark Theme Option */}
                    <div
                      onClick={() => handleThemeChange("dark")}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                        theme === "dark"
                          ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                          : "border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center text-lg border border-slate-800">
                          <FaMoon />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            Dark Mode
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Sleek dark theme for low-light
                          </p>
                        </div>
                      </div>

                      {theme === "dark" ? (
                        <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold">
                          <FaCheck />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Select</span>
                      )}
                    </div>

                    {/* Light Theme Option */}
                    <div
                      onClick={() => handleThemeChange("light")}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                        theme === "light"
                          ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                          : "border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg border border-amber-200">
                          <FaSun />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            Light Mode
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Clean, bright daylight interface
                          </p>
                        </div>
                      </div>

                      {theme === "light" ? (
                        <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold">
                          <FaCheck />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Select</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Accent Colors */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Accent Color Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                      { id: "sky", name: "Sky Blue", dotBg: "bg-sky-500", borderClass: "border-sky-500 bg-sky-500/15 shadow-lg shadow-sky-500/20 text-sky-600 dark:text-sky-300", checkColor: "text-sky-500" },
                      { id: "indigo", name: "Indigo", dotBg: "bg-indigo-500", borderClass: "border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/20 text-indigo-600 dark:text-indigo-300", checkColor: "text-indigo-500" },
                      { id: "emerald", name: "Emerald", dotBg: "bg-emerald-500", borderClass: "border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/20 text-emerald-600 dark:text-emerald-300", checkColor: "text-emerald-500" },
                      { id: "amber", name: "Amber", dotBg: "bg-amber-500", borderClass: "border-amber-500 bg-amber-500/15 shadow-lg shadow-amber-500/20 text-amber-600 dark:text-amber-300", checkColor: "text-amber-500" },
                      { id: "purple", name: "Purple", dotBg: "bg-purple-500", borderClass: "border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-500/20 text-purple-600 dark:text-purple-300", checkColor: "text-purple-500" },
                      { id: "rose", name: "Rose", dotBg: "bg-rose-500", borderClass: "border-rose-500 bg-rose-500/15 shadow-lg shadow-rose-500/20 text-rose-600 dark:text-rose-300", checkColor: "text-rose-500" }
                    ].map((accent) => {
                      const isActive = (accentColor || settings.accentColor) === accent.id;
                      return (
                        <button
                          key={accent.id}
                          type="button"
                          onClick={() => handleAccentChange(accent.id)}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                            isActive
                              ? `${accent.borderClass} ring-2 ring-offset-1 ring-offset-slate-900 ring-current`
                              : "border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-950/70 text-slate-700 dark:text-slate-200 hover:border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className={`w-4 h-4 rounded-full ${accent.dotBg} shrink-0 ring-2 ring-white/20 shadow-xs`} />
                            <span>{accent.name}</span>
                          </div>
                          {isActive && <FaCheck className={`${accent.checkColor} text-sm shrink-0`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Notification Preferences
              </h3>

              <div className="space-y-3">
                {[
                  { key: "emailAlerts", title: "Email Notifications", desc: "Receive trip confirmations and itinerary summaries via email" },
                  { key: "tripReminders", title: "Upcoming Trip Reminders", desc: "Get notified 3 days prior to your planned travel date" },
                  { key: "weatherAlerts", title: "Severe Weather Alerts", desc: "Live weather warnings for your saved trip destinations" },
                  { key: "marketingEmails", title: "Promotions & Flight Deals", desc: "Receive occasional newsletters for trending travel deals" }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => toggleSetting(item.key)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 cursor-pointer hover:border-sky-500/30 transition-all"
                  >
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    <button className="text-2xl text-sky-500">
                      {settings[item.key] ? <FaToggleOn /> : <FaToggleOff className="text-slate-400 dark:text-slate-600" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & PRIVACY */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Security & Account Privacy
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 text-lg">
                      <FaLock />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Account Password
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Update your secret account login password
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-800 dark:text-white text-xs font-extrabold transition-all"
                  >
                    Change Password
                  </button>
                </div>

                <div
                  onClick={() => toggleSetting("twoFactor")}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 cursor-pointer hover:border-sky-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 text-lg">
                      <FaShieldAlt />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Two-Factor Authentication (2FA)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>

                  <button className="text-2xl text-sky-500">
                    {settings.twoFactor ? <FaToggleOn /> : <FaToggleOff className="text-slate-400 dark:text-slate-600" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DATA & STORAGE */}
          {activeTab === "data" && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Data Management & Storage
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center text-lg">
                    <FaDownload />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Export Account Data
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Download a JSON file containing your preferences and saved settings
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="w-full py-2.5 rounded-xl bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white font-extrabold text-xs transition-all border border-sky-500/20"
                  >
                    Download Data JSON
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg">
                    <FaTrashAlt />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Clear Local Cache
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Remove temporary offline data stored on this browser device
                    </p>
                  </div>
                  <button
                    onClick={handleClearCache}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-extrabold text-xs transition-all border border-rose-500/20"
                  >
                    Clear Local Storage
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl animate-scaleUp">
            <h3 className="text-xl font-black text-white flex items-center space-x-2">
              <FaLock className="text-sky-500 text-lg" />
              <span>Change Account Password</span>
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
