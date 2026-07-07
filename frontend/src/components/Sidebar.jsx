import React from "react";
import { NavLink } from "react-router-dom";
import { FaChartPie, FaCalendarAlt, FaHistory, FaUser, FaTimes } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FaChartPie className="w-5 h-5" /> },
    { to: "/planner", label: "Travel Planner", icon: <FaCalendarAlt className="w-5 h-5" /> },
    { to: "/history", label: "Trip History", icon: <FaHistory className="w-5 h-5" /> },
    { to: "/profile", label: "My Profile", icon: <FaUser className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-16 left-0 z-35 flex w-64 flex-col border-r glass-panel bg-white/80 dark:bg-slate-900/80 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 lg:hidden border-b border-slate-200 dark:border-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Navigation</span>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <FaTimes className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
