import React from "react";
import {
  FaUsers,
  FaUserFriends,
  FaCalculator,
  FaBed,
  FaBus,
  FaUtensils,
  FaHeartbeat,
  FaMoneyBillWave,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";


const RELATIONSHIP_TYPES = [
  { value: "Friends", label: "👫 Friends & Buddies" },
  { value: "Family", label: "👨‍👩‍👧‍👦 Family Vacation" },
  { value: "Corporate Team", label: "💼 Corporate & Office Team" },
  { value: "College Trip", label: "🎓 College & Student Tour" },
  { value: "Pilgrimage", label: "🛕 Pilgrimage & Devotional Group" },
  { value: "Backpacking Group", label: "🎒 Backpackers & Adventurers" },
  { value: "Custom Group", label: "✨ Custom Travel Group" }
];

const SPLIT_METHODS = [
  { value: "Equal Split", label: "⚖️ Equal Split (All Members)" },
  { value: "Adults Only", label: "🧑 Adults Only (Children Free)" }
];

const SPECIAL_NEEDS_OPTIONS = [
  { id: "Vegetarian", label: "🥦 Pure Vegetarian" },
  { id: "Vegan", label: "🌱 Vegan Diet" },
  { id: "Jain Food", label: "🧅 Jain Food (No Onion/Garlic)" },
  { id: "Wheelchair Accessibility", label: "♿ Wheelchair Accessible" },
  { id: "Medical Conditions", label: "💊 Medical Care / First Aid" },
  { id: "Infants", label: "👶 Infant Friendly" },
  { id: "Senior Citizen Friendly", label: "👴 Senior Friendly Rest Pacing" },
  { id: "Pet Friendly", label: "🐾 Pet Friendly" }
];

const GroupPlanningForm = ({ groupState = {}, setGroupState, accentTheme = {} }) => {
  const safeState = groupState || {};
  const safeTheme = accentTheme || {};
  const totalTravelers = Number(safeState.adults_count || 0) + Number(safeState.children_count || 0) + Number(safeState.seniors_count || 0);
  const totalBudget = Number(safeState.total_budget) || 0;
  const isAdultsOnly = safeState.split_method && safeState.split_method.toLowerCase().includes("adult");
  const payingCount = isAdultsOnly
    ? Math.max(1, Number(safeState.adults_count || 0) + Number(safeState.seniors_count || 0))
    : Math.max(1, totalTravelers);
  const budgetPerPerson = payingCount > 0 ? (totalBudget / payingCount).toFixed(2) : 0;
  const expectedDailySpend = Number(safeState.days) > 0 ? (totalBudget / Number(safeState.days)).toFixed(2) : 0;

  const toggleSpecialNeed = (needId) => {
    const current = safeState.special_requirements || [];
    const updated = current.includes(needId)
      ? current.filter((item) => item !== needId)
      : [...current, needId];
    setGroupState((prev) => ({ ...prev, special_requirements: updated }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step 1: Group Identity & Relationship */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FaUsers className={accentTheme.text} />
          <span>1. Group Identity & Composition</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Group Name *
            </label>
            <input
              type="text"
              required
              value={groupState.group_name}
              onChange={(e) => setGroupState({ ...groupState, group_name: e.target.value })}
              placeholder="e.g. Goa Reunion Trekkers"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Group Organizer *
            </label>
            <input
              type="text"
              required
              value={groupState.organizer_name}
              onChange={(e) => setGroupState({ ...groupState, organizer_name: e.target.value })}
              placeholder="e.g. Pranav (Lead Organizer)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Relationship / Group Type *
            </label>
            <select
              value={groupState.relationship_type}
              onChange={(e) => setGroupState({ ...groupState, relationship_type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {RELATIONSHIP_TYPES.map((rel) => (
                <option key={rel.value} value={rel.value}>
                  {rel.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Adults (12+ yrs)</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{groupState.adults_count}</span>
            </div>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setGroupState({ ...groupState, adults_count: Math.max(1, groupState.adults_count - 1) })}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setGroupState({ ...groupState, adults_count: groupState.adults_count + 1 })}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Children (2-11 yrs)</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{groupState.children_count}</span>
            </div>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setGroupState({ ...groupState, children_count: Math.max(0, groupState.children_count - 1) })}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setGroupState({ ...groupState, children_count: groupState.children_count + 1 })}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Seniors (60+ yrs)</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{groupState.seniors_count}</span>
            </div>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setGroupState({ ...groupState, seniors_count: Math.max(0, groupState.seniors_count - 1) })}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setGroupState({ ...groupState, seniors_count: groupState.seniors_count + 1 })}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Badge */}
          <div className={`p-3.5 rounded-2xl ${accentTheme.badge} flex items-center justify-between`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block">Total Group Size</span>
              <span className="text-2xl font-black">{totalTravelers} Travelers</span>
            </div>
            <FaUserFriends className="text-2xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Step 2: Special Requirements & Food Preferences */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FaHeartbeat className="text-rose-500" />
          <span>2. Dietary & Accessibility Needs</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SPECIAL_NEEDS_OPTIONS.map((opt) => {
            const isSelected = (groupState.special_requirements || []).includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleSpecialNeed(opt.id)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-sky-500 bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-2 ring-sky-500/30"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 bg-white/50 dark:bg-slate-950/40"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <FaCheckCircle className="text-sky-500 shrink-0 text-sm" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Group Budgeting & Expense Splitting */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <FaMoneyBillWave className="text-emerald-500" />
            <span>3. Group Budget & Expense Splitting System</span>
          </h3>

          <div className="flex items-center space-x-3 text-xs font-extrabold">
            <span className="text-slate-500 dark:text-slate-400">
              Budget / Person: <strong className="text-emerald-500">₹{Number(budgetPerPerson).toLocaleString()}</strong>
            </span>
            <span>•</span>
            <span className="text-slate-500 dark:text-slate-400">
              Daily Spend: <strong className="text-sky-500">₹{Number(expectedDailySpend).toLocaleString()}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Total Group Budget (INR) *
            </label>
            <input
              type="number"
              required
              min="1000"
              value={groupState.total_budget ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setGroupState({ ...groupState, total_budget: val === "" ? "" : Number(val) });
              }}
              placeholder="e.g. 60000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Accommodation Budget
            </label>
            <input
              type="number"
              value={groupState.accommodation_budget ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setGroupState({ ...groupState, accommodation_budget: val === "" ? "" : Number(val) });
              }}
              placeholder="e.g. 24000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Food & Dining Budget
            </label>
            <input
              type="number"
              value={groupState.food_budget ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setGroupState({ ...groupState, food_budget: val === "" ? "" : Number(val) });
              }}
              placeholder="e.g. 15000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Expense Split Method
            </label>
            <select
              value={groupState.split_method}
              onChange={(e) => setGroupState({ ...groupState, split_method: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {SPLIT_METHODS.map((sm) => (
                <option key={sm.value} value={sm.value}>
                  {sm.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPlanningForm;
