import React from "react";
import { FaMapPin } from "react-icons/fa";

const AttractionCard = ({ attraction }) => {
  const { name, description, image_url, category } = attraction;

  const getCategoryColor = () => {
    switch (category.toLowerCase()) {
      case "beach":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "nature":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "historical":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "adventure":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "temple":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="glass-panel group overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Attraction Image Banner */}
      <div className="h-44 w-full relative overflow-hidden shrink-0">
        <img
          src={image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${getCategoryColor()}`}>
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <h4 className="font-extrabold text-slate-850 dark:text-white text-sm flex items-center gap-1.5 line-clamp-1">
            <FaMapPin className="text-rose-500 text-xs animate-bounce" /> {name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
