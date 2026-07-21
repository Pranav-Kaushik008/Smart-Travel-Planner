import React from "react";
import { FaPlane, FaClock, FaTicketAlt, FaExternalLinkAlt } from "react-icons/fa";

const getSkyscannerUrl = (origin, dest, date) => {
  if (!origin || !dest) return "https://www.skyscanner.co.in/";
  let formattedDate = "";
  if (date && date.includes("-")) {
    const parts = date.split("-"); // [YYYY, MM, DD]
    if (parts.length === 3) {
      // Format as YYMMDD
      formattedDate = parts[0].substring(2) + parts[1] + parts[2];
    }
  }
  return `https://www.skyscanner.co.in/transport/flights/${origin.toLowerCase()}/${dest.toLowerCase()}/${formattedDate}/?adults=1`;
};

const getCleartripUrl = (origin, dest, date) => {
  if (!origin || !dest) return "https://www.cleartrip.com/flights";
  let formattedDate = "";
  if (date && date.includes("-")) {
    const parts = date.split("-"); // [YYYY, MM, DD]
    if (parts.length === 3) {
      // Format as DD/MM/YYYY
      formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return `https://www.cleartrip.com/flights/results?from=${origin}&to=${dest}&depart_date=${formattedDate}&adults=1&childs=0&infants=0&class=Economy`;
};

const FlightCard = ({ flight, airportNote = null }) => {
  const { airline, flight_number, departure, arrival, duration, stops, logo_url, booking_url, origin_iata, dest_iata, date } = flight;

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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
        {/* Left Section: Flight detail & segment times */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          {/* Airline info */}
          <div className="flex items-center gap-3 min-w-[150px]">
            {renderLogo()}
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{airline}</div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{flight_number}</div>
            </div>
          </div>

          {/* Timings */}
          <div className="flex items-center gap-4 flex-1 justify-center w-full max-w-md">
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
              <div className="text-[9px] font-extrabold text-slate-455 dark:text-slate-500 uppercase tracking-widest">
                {stops === 0 ? "Non-Stop" : `${stops} Stop${stops > 1 ? "s" : ""}`}
              </div>
            </div>

            <div>
              <div className="text-sm font-extrabold text-slate-800 dark:text-white">{arrival}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrives</div>
            </div>
          </div>
        </div>

        {/* Right Section: Interactive Booking Links (Accurate Redirections, No random price!) */}
        <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-5 min-w-[180px] flex flex-col gap-2 shrink-0 justify-center">
          <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center md:text-left mb-0.5">
            Book Flight Ticket
          </div>
          <div className="grid grid-cols-1 gap-1.5 w-full">
            <a
              href={booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5"
            >
              Book on MakeMyTrip <FaExternalLinkAlt className="text-[8px]" />
            </a>
            <a
              href={getSkyscannerUrl(origin_iata, dest_iata, date)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-teal-500/10 flex items-center justify-center gap-1.5"
            >
              Book on Skyscanner <FaExternalLinkAlt className="text-[8px]" />
            </a>
            <a
              href={getCleartripUrl(origin_iata, dest_iata, date)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5"
            >
              Book on Cleartrip <FaExternalLinkAlt className="text-[8px]" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FlightCard;
