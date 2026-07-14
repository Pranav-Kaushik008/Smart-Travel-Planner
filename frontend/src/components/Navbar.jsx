import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaUser, FaSignOutAlt, FaCompass } from "react-icons/fa";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b bg-white/70 dark:bg-slate-900/70 shadow-sm backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-3">
          {user && (
            <button
              onClick={onToggleSidebar}
              className="mr-2 rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800 lg:hidden text-slate-600 dark:text-slate-300"
            >
              <FaBars className="h-5 w-5" />
            </button>
          )}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <FaCompass className="h-7 w-7 text-sky-500 animate-pulse" />
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Smart Travel Planner
            </span>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm font-medium text-slate-600 dark:text-slate-300">
                Hi, {user.full_name || user.username}
              </span>
              <Link
                to="/profile"
                className="rounded-full bg-slate-200 dark:bg-slate-800 p-2.5 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
                title="Profile"
              >
                <FaUser className="h-4 w-4" />
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
