import React, { useState } from "react";
import {
  FaUsers,
  FaUserFriends,
  FaUserPlus,
  FaTrashAlt,
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
  { value: "Adults Only", label: "🧑 Adults Only (Children Free)" },
  { value: "Custom Contribution", label: "✍️ Custom Contribution" },
  { value: "Percentage Split", label: "📊 Percentage Split" },
  { value: "Family Wise Split", label: "🏡 Family Wise Split" }
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

const GroupPlanningForm = ({ groupState, setGroupState, accentTheme }) => {
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: "",
    age: 25,
    gender: "Male",
    role: "Member",
    phone: "",
    email: "",
    emergency_contact: "",
    food_preference: "No Preference",
    special_needs: "",
    contribution_amount: 0
  });

  const totalTravelers = Number(groupState.adults_count) + Number(groupState.children_count) + Number(groupState.seniors_count);
  const totalBudget = Number(groupState.total_budget) || 0;
  const budgetPerPerson = totalTravelers > 0 ? (totalBudget / totalTravelers).toFixed(2) : 0;
  const expectedDailySpend = Number(groupState.days) > 0 ? (totalBudget / Number(groupState.days)).toFixed(2) : 0;

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;
    setGroupState((prev) => ({
      ...prev,
      members: [...(prev.members || []), { ...memberForm, id: Date.now() }]
    }));
    setMemberForm({
      name: "",
      age: 25,
      gender: "Male",
      role: "Member",
      phone: "",
      email: "",
      emergency_contact: "",
      food_preference: "No Preference",
      special_needs: "",
      contribution_amount: 0
    });
    setShowMemberModal(false);
  };

  const handleRemoveMember = (id) => {
    setGroupState((prev) => ({
      ...prev,
      members: (prev.members || []).filter((m) => m.id !== id)
    }));
  };

  const toggleSpecialNeed = (needId) => {
    const current = groupState.special_requirements || [];
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

      {/* Step 4: Group Members List & Roles */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <FaUserFriends className="text-indigo-500" />
            <span>4. Group Member Roster ({groupState.members?.length || 0} Listed)</span>
          </h3>

          <button
            type="button"
            onClick={() => setShowMemberModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-600 dark:text-indigo-400 font-extrabold text-xs transition-all border border-indigo-500/20"
          >
            <FaUserPlus />
            <span>Add Member</span>
          </button>
        </div>

        {groupState.members && groupState.members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {groupState.members.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs space-x-2"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">{m.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500">
                      {m.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Age: {m.age} • Diet: {m.food_preference}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMember(m.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs font-semibold">
            No specific members listed yet. Click "Add Member" to store traveler details, roles & diet preferences.
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Add Group Member</h4>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={memberForm.age}
                    onChange={(e) => setMemberForm({ ...memberForm, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gender</label>
                  <select
                    value={memberForm.gender}
                    onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Role</label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Member">Member</option>
                    <option value="Organizer">Organizer</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Driver">Driver</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Diet Preference</label>
                <select
                  value={memberForm.food_preference}
                  onChange={(e) => setMemberForm({ ...memberForm, food_preference: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="No Preference">No Preference (Non-Veg / Veg)</option>
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain Food">Jain Food</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black shadow-md"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPlanningForm;
