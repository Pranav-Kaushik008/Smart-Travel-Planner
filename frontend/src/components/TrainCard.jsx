import React from "react";
import { FaTrain, FaClock, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";

const TrainCard = ({ train }) => {
  const { train_name, train_number, departure, arrival, duration, classes, fare, booking_url } = train;

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
        {/* Left: Train details */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-base shrink-0">
            <FaTrain />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              {train_name}
            </div>
            <div className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider w-fit mt-0.5">
              Train #{train_number}
            </div>
          </div>
        </div>

        {/* Center: Route timings */}
        <div className="flex items-center gap-4 flex-1 justify-center w-full">
          <div className="text-right">
            <div className="text-sm font-extrabold text-slate-800 dark:text-white">{departure}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departs</div>
          </div>

          <div className="flex flex-col items-center flex-1 max-w-[120px] px-2">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <FaClock className="text-[9px]" /> {duration}
            </div>
            <div className="w-full relative flex items-center justify-center my-1.5">
              <div className="w-full h-px bg-slate-200 dark:bg-slate-850"></div>
              <div className="absolute w-2 h-2 rounded-full bg-indigo-500"></div>
            </div>
            <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
              Daily
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white">{arrival}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrives</div>
          </div>
        </div>

        {/* Right: Fare & Book */}
        <div className="text-right sm:border-l sm:border-slate-150 sm:dark:border-slate-850 sm:pl-4 min-w-[110px] w-full sm:w-auto flex sm:block items-center justify-between sm:justify-end">
          <div className="sm:mb-1 text-left sm:text-right">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fare starting from</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              ₹{fare.toLocaleString("en-IN")}
            </div>
          </div>
          <a
            href={booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1.5"
          >
            <FaCalendarAlt className="text-[10px]" /> Book on IRCTC
          </a>
        </div>
      </div>

      {/* Available Coach Classes */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Available Coaches:</span>
          {classes.map((cls) => (
            <span
              key={cls}
              className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-850"
            >
              {cls}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
          ● Available
        </span>
      </div>
    </div>
  );
};

export default TrainCard;
