import React from "react";

const StatsCard = ({ title, value, icon, description, trend }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold mt-2 text-slate-800 dark:text-white">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-sky-500/10 text-sky-500 dark:text-sky-400 rounded-2xl">
          {icon}
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center space-x-2">
          {trend && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              {trend}
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-sky-500/10 to-indigo-500/0 rounded-bl-full pointer-events-none" />
    </div>
  );
};

export default StatsCard;
