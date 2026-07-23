import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaBars, FaUser, FaSignOutAlt, FaCompass, FaSun, FaMoon } from "react-icons/fa";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-md transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-3">
          {user && (
            <button
              onClick={onToggleSidebar}
              className="mr-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden text-slate-600 dark:text-slate-300"
            >
              <FaBars className="h-5 w-5" />
            </button>
          )}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <FaCompass className="h-7 w-7 text-sky-500 animate-pulse" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Smart Travel Planner
            </span>
          </Link>
        </div>

        <nav className="flex items-center space-x-3 sm:space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xs overflow-hidden"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? (
              <FaSun className="h-4 w-4 text-amber-400" />
            ) : (
              <FaMoon className="h-4 w-4 text-indigo-500" />
            )}
          </button>

          {user ? (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="hidden md:inline text-sm font-medium text-slate-600 dark:text-slate-300">
                Hi, {user.full_name || user.username}
              </span>
              <Link
                to="/profile"
                className="rounded-full bg-slate-100 dark:bg-slate-800 hover:ring-2 hover:ring-sky-500 transition-all overflow-hidden w-9 h-9 flex items-center justify-center border-2 border-transparent"
                title="Profile"
              >
                {user.profile_pic ? (
                  <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3.5 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all shadow-md hover:shadow-rose-500/20"
                title="Logout"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4.5 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md hover:shadow-sky-500/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
