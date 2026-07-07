import React from "react";
import { FaMapMarkerAlt, FaUtensils, FaLightbulb, FaRegCalendarAlt } from "react-icons/fa";

const ItineraryTimeline = ({ itinerary }) => {
  if (!itinerary) return null;

  // Simple parser to extract Days from itinerary markdown text
  const parseItinerary = (text) => {
    if (!text) return [];
    
    // Split by Markdown headers like "#### Day" or "### Day" or "Day "
    const lines = text.split(/\n/);
    const days = [];
    let currentDay = null;

    lines.forEach((line) => {
      const dayMatch = line.match(/^(?:#+\s*)?Day\s*(\d+)[:\s-]*(.*)/i);
      if (dayMatch) {
        if (currentDay) {
          days.push(currentDay);
        }
        currentDay = {
          dayNumber: dayMatch[1],
          title: dayMatch[2].trim() || "Activities Plan",
          activities: [],
          restaurants: [],
          tips: []
        };
      } else if (currentDay) {
        const cleaned = line.replace(/^[-*+\s]+/, "").trim();
        if (cleaned) {
          if (line.toLowerCase().includes("dining") || line.toLowerCase().includes("restaurant") || line.toLowerCase().includes("food")) {
            currentDay.restaurants.push(cleaned);
          } else if (line.toLowerCase().includes("tip") || line.toLowerCase().includes("essential") || line.toLowerCase().includes("advice")) {
            currentDay.tips.push(cleaned);
          } else {
            currentDay.activities.push(cleaned);
          }
        }
      }
    });

    if (currentDay) {
      days.push(currentDay);
    }
    
    return days.length > 0 ? days : null;
  };

  const parsedDays = parseItinerary(itinerary);

  // If parsing fails to yield structured days (e.g. general text description), render fallback raw markdown layout
  if (!parsedDays) {
    return (
      <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
          <FaRegCalendarAlt className="mr-2 text-sky-500" /> Day-Wise Plan
        </h3>
        <div className="prose dark:prose-invert max-w-none text-sm text-slate-650 dark:text-slate-300 whitespace-pre-line leading-relaxed">
          {itinerary}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
        <FaRegCalendarAlt className="mr-2 text-sky-500" /> Detailed Day-Wise Itinerary
      </h3>
      
      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 md:pl-8 space-y-8">
        {parsedDays.map((day, idx) => (
          <div key={idx} className="relative">
            {/* Timeline node icon */}
            <span className="absolute -left-[41px] md:-left-[49px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow-md">
              {day.dayNumber}
            </span>
            
            <div className="bg-slate-500/5 dark:bg-slate-100/5 p-5 rounded-2xl border border-slate-200/10 hover:border-slate-200/30 transition-all">
              <h4 className="font-extrabold text-base text-slate-800 dark:text-white mb-3">
                Day {day.dayNumber}: {day.title}
              </h4>

              <div className="space-y-4">
                {day.activities.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-sky-500 dark:text-sky-400 uppercase tracking-wider mb-1.5 flex items-center">
                      <FaMapMarkerAlt className="mr-1.5" /> Attractions & Activities
                    </h5>
                    <ul className="space-y-1.5">
                      {day.activities.map((act, idx) => (
                        <li key={idx} className="text-sm text-slate-650 dark:text-slate-305 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate-400">
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.restaurants.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center">
                      <FaUtensils className="mr-1.5" /> Recommended Dining
                    </h5>
                    <ul className="space-y-1">
                      {day.restaurants.map((rest, idx) => (
                        <li key={idx} className="text-sm text-slate-650 dark:text-slate-305 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate-400">
                          {rest}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.tips.length > 0 && (
                  <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl mt-3">
                    <h5 className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center">
                      <FaLightbulb className="mr-1.5" /> Travel Tip
                    </h5>
                    <ul className="space-y-1">
                      {day.tips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-slate-600 dark:text-slate-350">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryTimeline;
