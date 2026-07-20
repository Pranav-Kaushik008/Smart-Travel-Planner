import React from "react";
import { FaMapMarkerAlt, FaRoute, FaCar, FaClock } from "react-icons/fa";

const RouteSummary = ({ route }) => {
  if (!route) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 animate-pulse space-y-4">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const { origin_city, origin_state, dest_city, distance_km, duration_text, route_summary } = route;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
          <FaRoute className="text-sky-500 text-lg" /> Route Information
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
          <FaCar className="text-[10px]" /> Best by Road
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 text-lg shrink-0">
            <FaMapMarkerAlt />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starting Point</div>
            <div className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
              {origin_city}, {origin_state}
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center flex-1 px-4">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>{distance_km} km</span>
            <span>{duration_text}</span>
          </div>
          <div className="w-full relative flex items-center justify-center">
            <div className="w-full h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-700"></div>
            <div className="absolute w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-500">
              <FaCar className="text-xs" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-lg shrink-0">
            <FaMapMarkerAlt />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended Destination</div>
            <div className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
              {dest_city}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view of stats */}
      <div className="flex md:hidden items-center justify-around bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-3.5 mt-5">
        <div className="text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance</div>
          <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{distance_km} km</div>
        </div>
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-850"></div>
        <div className="text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <FaClock className="text-sky-500" /> Travel Time
          </div>
          <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{duration_text}</div>
        </div>
      </div>

      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-4 leading-relaxed bg-slate-50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-900/60">
        <strong className="text-slate-700 dark:text-slate-350">Route Summary:</strong> {route_summary}
      </p>
    </div>
  );
};

export default RouteSummary;
