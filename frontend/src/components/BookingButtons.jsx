import React from "react";
import { FaPlane, FaHotel, FaTrain, FaBus, FaExternalLinkAlt } from "react-icons/fa";

const BookingButtons = ({ destination, type }) => {
  const encDest = encodeURIComponent(destination);

  if (type === "flights") {
    return (
      <div className="flex flex-wrap gap-2.5">
        <a
          href={`https://www.makemytrip.com/flights/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/25 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold transition-all shadow-xs"
        >
          <FaPlane /> MakeMyTrip <FaExternalLinkAlt className="text-[9px]" />
        </a>
        <a
          href={`https://www.skyscanner.co.in/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/25 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold transition-all shadow-xs"
        >
          <FaPlane /> Skyscanner <FaExternalLinkAlt className="text-[9px]" />
        </a>
      </div>
    );
  }

  if (type === "hotels") {
    return (
      <div className="flex flex-wrap gap-2.5">
        <a
          href={`https://www.booking.com/searchresults.html?ss=${encDest}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600/10 hover:bg-sky-600/25 border border-sky-600/25 text-sky-600 dark:text-sky-400 text-xs font-bold transition-all shadow-xs"
        >
          <FaHotel /> Booking.com <FaExternalLinkAlt className="text-[9px]" />
        </a>
        <a
          href={`https://www.agoda.com/search?city=${encDest}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-xs"
        >
          <FaHotel /> Agoda <FaExternalLinkAlt className="text-[9px]" />
        </a>
        <a
          href={`https://www.makemytrip.com/hotels/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all shadow-xs"
        >
          <FaHotel /> MakeMyTrip Hotels <FaExternalLinkAlt className="text-[9px]" />
        </a>
      </div>
    );
  }

  if (type === "trains") {
    return (
      <div className="flex flex-wrap gap-2.5">
        <a
          href="https://www.irctc.co.in/nget/train-search"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-xs"
        >
          <FaTrain /> IRCTC Official Portal <FaExternalLinkAlt className="text-[9px]" />
        </a>
      </div>
    );
  }

  if (type === "buses") {
    return (
      <div className="flex flex-wrap gap-2.5">
        <a
          href="https://www.redbus.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all shadow-xs"
        >
          <FaBus /> RedBus Portal <FaExternalLinkAlt className="text-[9px]" />
        </a>
      </div>
    );
  }

  return null;
};

export default BookingButtons;
