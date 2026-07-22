import React from "react";
import { FaMapMarkerAlt, FaUtensils, FaLightbulb, FaCalendarAlt, FaSun, FaMoon, FaCompass, FaCheckCircle } from "react-icons/fa";

const ItineraryTimeline = ({ itinerary }) => {
  if (!itinerary) return null;

  // Ultra-robust parser to extract Days and Essential Tips from any AI markdown format
  const parseItinerary = (text) => {
    if (!text) return { days: [], generalTips: [] };

    const lines = text.split(/\n/);
    const days = [];
    const generalTips = [];
    let currentDay = null;
    let inGeneralTips = false;

    lines.forEach((line) => {
      const rawTrimmed = line.trim();
      if (!rawTrimmed || rawTrimmed === "--" || rawTrimmed === "---") return;

      // Clean line for header matching by stripping leading #, *, -, tabs, and inline **
      const unbolded = rawTrimmed.replace(/\*\*/g, "").replace(/\*/g, "").trim();
      const strippedHeader = unbolded.replace(/^[#*-\s]+/, "").trim();

      // Check for Day headers (e.g., "Day 1: ...", "Day 1 - ...", "Day 1")
      const dayMatch = strippedHeader.match(/^Day\s*(\d+)[:\s-]*(.*)/i);
      const tipHeaderMatch = strippedHeader.match(/^(?:💡\s*)?(?:Essential\s+)?Travel\s+Tips/i);

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
          title: dayMatch[2].trim() || "Day Highlights",
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
        const cleaned = strippedHeader.replace(/^[*-+\d.\s]+/, "").trim();
        if (cleaned) generalTips.push(cleaned);
        return;
      }

      if (currentDay) {
        const cleaned = rawTrimmed.replace(/^[-*+\s]+/, "").trim();
        if (!cleaned) return;

        const lower = unbolded.toLowerCase();

        if (lower.includes("morning")) {
          currentDay.morning.push(cleaned.replace(/^\*\*morning\*\*[:\s-]*/i, ""));
        } else if (lower.includes("afternoon")) {
          currentDay.afternoon.push(cleaned.replace(/^\*\*afternoon\*\*[:\s-]*/i, ""));
        } else if (lower.includes("evening") || lower.includes("night")) {
          currentDay.evening.push(cleaned.replace(/^\*\*evening\*\*[:\s-]*/i, ""));
        } else if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("food") || lower.includes("thali") || lower.includes("lunch") || lower.includes("dinner")) {
          currentDay.dining.push(cleaned.replace(/^\*\*dining suggestion\*\*[:\s-]*/i, "").replace(/^\*\*dining\*\*[:\s-]*/i, ""));
        } else if (lower.startsWith("tip:") || lower.includes("travel tip")) {
          currentDay.tips.push(cleaned.replace(/^\*\*tip\*\*[:\s-]*/i, ""));
        } else {
          currentDay.generalItems.push(cleaned);
        }
      }
    });

    if (currentDay) days.push(currentDay);

    return { days, generalTips };
  };

  const { days, generalTips } = parseItinerary(itinerary);

  // Format bold markdown text inside list items nicely
  const formatText = (text) => {
    return text.replace(/\*\*/g, "").replace(/^\*+|\*+$/g, "").trim();
  };

  // Render nicely formatted fallback if days array couldn't be parsed
  if (!days || days.length === 0) {
    const formattedParagraphs = itinerary
      .split(/\n\n+/)
      .map(p => p.replace(/^#+\s*/, "").replace(/^[*-]\s*/, "").replace(/--/g, "").trim())
      .filter(p => p.length > 0);

    return (
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-lg shrink-0">
            <FaCalendarAlt />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Day-Wise Travel Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Detailed itinerary & sightseeing guide
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {formattedParagraphs.map((paragraph, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed"
            >
              {formatText(paragraph)}
            </div>
          ))}
        </div>
      </div>
    );
  }

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

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-extrabold w-fit border border-sky-500/20">
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
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15">
                    <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 text-sm shrink-0 mt-0.5">
                      <FaSun />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                        Morning Activity
                      </span>
                      {day.morning.map((m, i) => (
                        <p key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed mb-1 last:mb-0">
                          {formatText(m)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* AFTERNOON BLOCK */}
                {day.afternoon.length > 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/15">
                    <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 text-sm shrink-0 mt-0.5">
                      <FaSun />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
                        Afternoon Activity
                      </span>
                      {day.afternoon.map((a, i) => (
                        <p key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed mb-1 last:mb-0">
                          {formatText(a)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* EVENING BLOCK */}
                {day.evening.length > 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15">
                    <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-sm shrink-0 mt-0.5">
                      <FaMoon />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                        Evening Vibe & Sightseeing
                      </span>
                      {day.evening.map((e, i) => (
                        <p key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed mb-1 last:mb-0">
                          {formatText(e)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* DINING SUGGESTIONS */}
                {day.dining.length > 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-sm shrink-0 mt-0.5">
                      <FaUtensils />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                        Recommended Dining
                      </span>
                      {day.dining.map((d, i) => (
                        <p key={i} className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed mb-1 last:mb-0">
                          {formatText(d)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* GENERAL ACTIVITIES */}
                {day.generalItems.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Key Highlights & Details
                    </span>
                    <div className="space-y-2">
                      {day.generalItems.map((item, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-slate-500/5 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/60 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-start gap-2.5">
                          <FaCheckCircle className="text-sky-500 text-sm shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{formatText(item)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DAY TIPS */}
                {day.tips.length > 0 && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-slate-700 dark:text-slate-200 text-xs font-semibold mt-2">
                    <FaLightbulb className="text-amber-500 text-base shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      {day.tips.map((t, i) => (
                        <p key={i} className="leading-relaxed">{formatText(t)}</p>
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
                {formatText(tip)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryTimeline;
