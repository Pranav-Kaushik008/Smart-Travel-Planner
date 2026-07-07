import React from "react";
import { FaCalendarAlt, FaTrash, FaWallet, FaChevronRight } from "react-icons/fa";
import { DESTINATION_COVERS } from "../utils/constants";

const TripCard = ({ trip, onDelete, onViewDetails }) => {
  const dateStr = new Date(trip.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const coverUrl = DESTINATION_COVERS[trip.destination] || 
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500";

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row h-full">
      <div className="sm:w-44 h-36 sm:h-auto bg-slate-200 dark:bg-slate-800 relative">
        <img
          src={coverUrl}
          alt={trip.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider flex items-center">
          {trip.travel_type}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-0.5">
                {trip.destination}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mb-3">
                <FaCalendarAlt className="mr-1" /> {trip.days} Days • {trip.season}
              </p>
            </div>
            <button
              onClick={() => onDelete(trip.id)}
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              title="Delete Trip"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-slate-500/5 dark:bg-white/5 px-3 py-2 rounded-xl mb-4">
            <FaWallet className="text-sky-500 w-3.5 h-3.5" />
            <span className="text-xs text-slate-600 dark:text-slate-350">
              Total Budget: <strong className="text-slate-800 dark:text-white">₹{trip.budget.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
          <span className="text-[10px] text-slate-500 dark:text-slate-450 font-semibold">
            Saved on {dateStr}
          </span>
          <button
            onClick={() => onViewDetails(trip)}
            className="text-xs font-bold text-sky-500 flex items-center hover:translate-x-1 transition-all"
          >
            View Details <FaChevronRight className="ml-1 w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
