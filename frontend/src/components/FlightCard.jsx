import React from "react";
import { FaPlane, FaClock, FaTicketAlt, FaExternalLinkAlt } from "react-icons/fa";

const FlightCard = ({ flight, airportNote = null }) => {
  const { airline, flight_number, departure, arrival, duration, stops, price, currency, logo_url, booking_url } = flight;

  // Render initials inside a colored block if logo_url is missing
  const renderLogo = () => {
    if (logo_url) {
      return <img src={logo_url} alt={airline} className="w-9 h-9 object-contain" />;
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 font-extrabold text-sm uppercase">
        {airline.substring(0, 2)}
      </div>
    );
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
        {/* Left: Airline info */}
        <div className="flex items-center gap-3">
          {renderLogo()}
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">{airline}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{flight_number}</div>
          </div>
        </div>

        {/* Center: Flight segment times */}
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
              <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>
              <div className="absolute w-2 h-2 rounded-full bg-sky-500"></div>
            </div>
            <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
              {stops === 0 ? "Non-Stop" : `${stops} Stop${stops > 1 ? "s" : ""}`}
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white">{arrival}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrives</div>
          </div>
        </div>

        {/* Right: Price & Main CTA */}
        <div className="text-right sm:border-l sm:border-slate-150 sm:dark:border-slate-850 sm:pl-4 min-w-[110px] w-full sm:w-auto flex sm:block items-center justify-between sm:justify-end">
          <div className="sm:mb-1 text-left sm:text-right">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starting from</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              ₹{price.toLocaleString("en-IN")}
            </div>
          </div>
          <a
            href={booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1.5"
          >
            <FaTicketAlt className="text-[10px]" /> Book Now
          </a>
        </div>
      </div>

      {/* Airport notes */}
      {airportNote && (
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-100/80 dark:bg-slate-950/60 p-3 text-[11px] text-slate-600 dark:text-slate-300 mb-3">
          <span className="font-semibold">Airport:</span> {airportNote}
        </div>
      )}

      {/* Alternative Booking shortcuts */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1">Compare on:</span>
        <a
          href={`https://www.skyscanner.co.in/transport/flights/in/in/?adults=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-sky-50 dark:bg-slate-950 dark:hover:bg-sky-950/40 text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors border border-slate-100 dark:border-slate-800 flex items-center gap-1"
        >
          Skyscanner <FaExternalLinkAlt className="text-[8px]" />
        </a>
        <a
          href={`https://www.cleartrip.com/flights`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-rose-50 dark:bg-slate-950 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors border border-slate-100 dark:border-slate-800 flex items-center gap-1"
        >
          Cleartrip <FaExternalLinkAlt className="text-[8px]" />
        </a>
      </div>
    </div>
  );
};

export default FlightCard;
