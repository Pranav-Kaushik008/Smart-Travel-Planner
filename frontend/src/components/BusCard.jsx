import React from "react";
import { FaBus, FaClock, FaStar, FaExternalLinkAlt, FaWifi, FaBolt, FaCoffee, FaMapMarkerAlt } from "react-icons/fa";

const BusCard = ({ bus }) => {
  const { operator, bus_type, departure, arrival, duration, amenities, seats_available, price, rating, booking_url } = bus;

  const renderAmenityIcon = (amenity) => {
    const norm = amenity.toLowerCase();
    if (norm.includes("wifi")) return <FaWifi title="WiFi Available" className="text-slate-400 hover:text-sky-500 transition-colors" />;
    if (norm.includes("charge") || norm.includes("usb")) return <FaBolt title="USB Charging Available" className="text-slate-400 hover:text-amber-500 transition-colors" />;
    if (norm.includes("water")) return <FaCoffee title="Water Bottle Provided" className="text-slate-400 hover:text-blue-400 transition-colors" />;
    return null;
  };

  const getSeatColor = () => {
    if (seats_available > 10) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (seats_available >= 5) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
        {/* Left: Bus Operator info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 text-base shrink-0">
            <FaBus />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              {operator}
              <span className="flex items-center gap-0.5 text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-lg border border-amber-500/10 font-bold">
                <FaStar className="text-[9px] fill-amber-500" /> {rating}
              </span>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{bus_type}</div>
          </div>
        </div>

        {/* Center: Timings */}
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
              <div className="absolute w-2 h-2 rounded-full bg-rose-500"></div>
            </div>
            <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
              Direct Route
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white">{arrival}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrives</div>
          </div>
        </div>

        {/* Right: RedBus Redirect */}
        <div className="border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4 min-w-[130px] w-full sm:w-auto flex items-center justify-end shrink-0">
          <a
            href={booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-500/10 flex items-center justify-center gap-1.5"
          >
            Book on RedBus <FaExternalLinkAlt className="text-[8px]" />
          </a>
        </div>
      </div>

      {/* Seat availability and Amenities */}
      <div className="flex items-center justify-between mt-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getSeatColor()}`}>
          {seats_available} seats left
        </span>

        {/* Amenity icons */}
        <div className="flex items-center gap-3.5 text-sm">
          {amenities.map((am, idx) => (
            <React.Fragment key={idx}>
              {renderAmenityIcon(am)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusCard;
