import React from "react";
import { FaStar, FaBed, FaCheck } from "react-icons/fa";

const HotelCard = ({ hotel }) => {
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < floor) {
        stars.push(<FaStar key={i} className="text-amber-500 w-3.5 h-3.5 fill-current" />);
      } else {
        stars.push(<FaStar key={i} className="text-slate-300 dark:text-slate-700 w-3.5 h-3.5" />);
      }
    }
    return stars;
  };

  const amenitiesList = hotel.amenities 
    ? hotel.amenities.split(",").map(a => a.trim())
    : ["Free Wi-Fi", "Breakfast", "AC"];

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-850">
        <img
          src={hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1 shadow-sm">
          <FaStar className="text-amber-500 w-3 h-3 fill-current" />
          <span>{hotel.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-base text-slate-800 dark:text-white line-clamp-1 mb-1">
            {hotel.name}
          </h4>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
            📍 {hotel.destination}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenitiesList.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold px-2 py-0.5 bg-sky-500/10 text-sky-500 dark:text-sky-400 rounded-full flex items-center"
              >
                <FaCheck className="w-2 h-2 mr-1" /> {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
              Price per night
            </span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-white">
              ₹{hotel.price_per_night.toLocaleString()}
            </span>
          </div>
          <span className="text-xs font-bold text-sky-500 bg-sky-500/10 hover:bg-sky-500 hover:text-white transition-all px-3 py-1.5 rounded-xl cursor-pointer">
            Select
          </span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
