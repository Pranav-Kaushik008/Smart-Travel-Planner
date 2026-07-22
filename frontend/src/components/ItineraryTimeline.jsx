import React from "react";
import { FaMapMarkerAlt, FaUtensils, FaLightbulb, FaCalendarAlt, FaSun, FaMoon, FaCompass } from "react-icons/fa";

const ItineraryTimeline = ({ itinerary }) => {
  if (!itinerary) return null;

  // Parser to extract Days and Essential Tips from markdown text
  const parseItinerary = (text) => {
    if (!text) return { days: [], generalTips: [] };

    const lines = text.split(/\n/);
    const days = [];
    const generalTips = [];
    let currentDay = null;
    let inGeneralTips = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Check for Day headers (e.g., "#### Day 1", "Day 1:", "### Day 2 - ...")
      const dayMatch = trimmed.match(/^(?:#+\s*)?Day\s*(\d+)[:\s-]*(.*)/i);
      const tipHeaderMatch = trimmed.match(/^(?:#+\s*)?(?:💡\s*)?(?:Essential\s+)?Travel\s+Tips/i);

      if (tipHeaderMatch) {
        if (currentDay) days.push(currentDay);
        currentDay = null;
        inGeneralTips = true;
        return;
      }

      if (dayMatch) {
        inGeneralTips = false;
        if (currentDay) days.push(currentDay);
        
        currentDay = {
          dayNumber: dayMatch[1],
          title: dayMatch[2].replace(/\*\*/g, "").trim() || "Day Highlights",
          morning: [],
          afternoon: [],
          evening: [],
          dining: [],
          generalItems: [],
          tips: []
        };
        return;
      }

      if (inGeneralTips) {
        const cleaned = trimmed.replace(/^[-*+\d.\s]+/, "").replace(/\*\*/g, "").trim();
        if (cleaned) generalTips.push(cleaned);
        return;
      }

      if (currentDay) {
        const cleaned = trimmed.replace(/^[-*+\s]+/, "").trim();
        if (!cleaned) return;

        const lower = cleaned.toLowerCase();
        
        if (lower.includes("morning")) {
          currentDay.morning.push(cleaned.replace(/^\*\*morning\*\*[:\s-]*/i, ""));
        } else if (lower.includes("afternoon")) {
          currentDay.afternoon.push(cleaned.replace(/^\*\*afternoon\*\*[:\s-]*/i, ""));
        } else if (lower.includes("evening") || lower.includes("night")) {
          currentDay.evening.push(cleaned.replace(/^\*\*evening\*\*[:\s-]*/i, ""));
        } else if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("food") || lower.includes("thali")) {
          currentDay.dining.push(cleaned.replace(/^\*\*dining suggestion\*\*[:\s-]*/i, "").replace(/^\*\*dining\*\*[:\s-]*/i, ""));
        } else if (lower.includes("tip") || lower.includes("advice")) {
          currentDay.tips.push(cleaned.replace(/^\*\*tip\*\*[:\s-]*/i, ""));
        } else {
          currentDay.generalItems.push(cleaned.replace(/\*\*/g, ""));
        }
      }
    });

    if (currentDay) days.push(currentDay);

    return { days, generalTips };
  };

  const { days, generalTips } = parseItinerary(itinerary);

  // Fallback if structured parsing yields no days
  if (!days || days.length === 0) {
    return (
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 text-lg">
            <FaCalendarAlt />
          </div>
          <span>Day-Wise Travel Plan</span>
        </h3>
        <div className="prose dark:prose-invert max-w-none text-sm text-slate-650 dark:text-slate-300 whitespace-pre-line leading-relaxed">
          {itinerary}
        </div>
      </div>
    );
  }

  // Format bold markdown text inside list items nicely
  const formatText = (text) => {
    // Simple helper to remove markdown asterisks
    return text.replace(/\*\*/g, "");
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xl shadow-md shadow-sky-500/20 shrink-0">
            <FaCalendarAlt />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Day-by-Day Vacation Plan
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Custom curated timeline with morning, afternoon & evening activities
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold w-fit border border-sky-500/20">
          <FaCompass className="text-xs" /> {days.length} Days Planned
        </div>
      </div>

      {/* Timeline Node List */}
      <div className="relative border-l-2 border-slate-200/80 dark:border-slate-800 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
        {days.map((day, idx) => (
          <div key={idx} className="relative group">
            {/* Day Number Badge Node */}
            <span className="absolute -left-[41px] sm:-left-[49px] top-1 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-black text-xs sm:text-sm ring-4 ring-white dark:ring-slate-900 shadow-md transition-transform duration-300 group-hover:scale-110">
              {day.dayNumber}
            </span>

            {/* Main Day Container Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <h4 className="font-black text-base sm:text-lg text-slate-850 dark:text-white flex items-center gap-2">
                  <span>Day {day.dayNumber}:</span>
                  <span className="text-slate-700 dark:text-slate-200 font-bold">{day.title}</span>
                </h4>
              </div>

              {/* Time-Segmented Activity Grid */}
              <div className="space-y-3.5 pt-1">
                {/* MORNING BLOCK */}
                {day.morning.length > 0 && (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15">
                    <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 text-sm shrink-0 mt-0.5">
                      <FaSun />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                        Morning Activity
                      </span>
                      {day.morning.map((m, i) => (
                        <p key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                          {formatText(m)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* AFTERNOON BLOCK */}
                {day.afternoon.length > 0 && (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/15">
                    <div className="p-2 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 text-sm shrink-0 mt-0.5">
                      <FaSun />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-0.5">
                        Afternoon Activity
                      </span>
                      {day.afternoon.map((a, i) => (
                        <p key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                          {formatText(a)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* EVENING BLOCK */}
                {day.evening.length > 0 && (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-sm shrink-0 mt-0.5">
                      <FaMoon />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
                        Evening Vibe & Sightseeing
                      </span>
                      {day.evening.map((e, i) => (
                        <p key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                          {formatText(e)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* DINING SUGGESTIONS */}
                {day.dining.length > 0 && (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-sm shrink-0 mt-0.5">
                      <FaUtensils />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        Recommended Dining
                      </span>
                      {day.dining.map((d, i) => (
                        <p key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                          {formatText(d)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* GENERAL ACTIVITIES FALLBACK (if morning/afternoon/evening tags weren't used) */}
                {day.generalItems.length > 0 && day.morning.length === 0 && day.afternoon.length === 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Day Activities
                    </span>
                    <ul className="space-y-2">
                      {day.generalItems.map((item, i) => (
                        <li key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                          <span>{formatText(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* DAY TIPS */}
                {day.tips.length > 0 && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-xs font-semibold mt-2">
                    <FaLightbulb className="text-amber-500 text-sm shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      {day.tips.map((t, i) => (
                        <p key={i}>{formatText(t)}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ESSENTIAL TRAVEL TIPS CARD */}
      {generalTips.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/20 space-y-3 mt-6">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wider">
            <FaLightbulb className="text-base" /> Essential Travel Tips
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {generalTips.map((tip, idx) => (
              <div key={idx} className="bg-white/70 dark:bg-slate-900/70 p-3.5 rounded-2xl border border-amber-500/10 text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed shadow-2xs">
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryTimeline;
