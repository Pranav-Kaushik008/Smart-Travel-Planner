import React, { useState } from "react";
import api from "../../api/axios";
import {
  FaUsers,
  FaBed,
  FaBus,
  FaHospital,
  FaMoneyBillWave,
  FaCalculator,
  FaPlus,
  FaChartPie,
  FaShieldAlt,
  FaChevronRight,
  FaCheckCircle,
  FaExchangeAlt,
  FaTrashAlt,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaParking,
  FaGasPump
} from "react-icons/fa";
import toast from "react-hot-toast";

const GroupDashboardView = ({ recommendation, groupState, accentTheme, groupTripId }) => {
  const [expenses, setExpenses] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    paid_by: groupState.organizer_name || "Organizer",
    split_between: "All Members"
  });
  const [addingExpense, setAddingExpense] = useState(false);

  if (!recommendation) return null;

  const roomPlan = recommendation.room_plan || {};
  const transportPlan = recommendation.transport_plan || {};
  const emergencyDir = recommendation.emergency_directory || {};
  const splitSummary = recommendation.split_summary || [];

  // Live Calculations
  const totalExpensesLogged = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const remainingGroupBudget = Math.max(0, Number(groupState.total_budget || 0) - totalExpensesLogged);
  const budgetUtilization = Number(groupState.total_budget || 0) > 0
    ? Math.min(100, (totalExpensesLogged / Number(groupState.total_budget)) * 100).toFixed(1)
    : 0;

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.title.trim() || !expenseForm.amount) return;

    setAddingExpense(true);
    try {
      if (groupTripId) {
        await api.post("/group/expenses", expenseForm, {
          params: { group_trip_id: groupTripId }
        });
      }
      setExpenses((prev) => [...prev, { ...expenseForm, id: Date.now(), amount: Number(expenseForm.amount) }]);
      toast.success(`Logged expense: ${expenseForm.title} (₹${expenseForm.amount})`);
      setExpenseForm({
        title: "",
        amount: "",
        category: "Food",
        paid_by: groupState.organizer_name || "Organizer",
        split_between: "All Members"
      });
      setShowExpenseModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to log expense.");
    } finally {
      setAddingExpense(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Group Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Group Size</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{recommendation.total_travelers} Travelers</h3>
            <FaUsers className="text-sky-500 text-xl" />
          </div>
          <span className="text-[11px] font-bold text-sky-500">
            {groupState.adults_count} Adults • {groupState.children_count} Kids • {groupState.seniors_count} Seniors
          </span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Group Budget</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-emerald-500">₹{Number(groupState.total_budget || 0).toLocaleString()}</h3>
            <FaMoneyBillWave className="text-emerald-500 text-xl" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            ₹{recommendation.budget_per_person?.toLocaleString()} / Person
          </span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Remaining Budget</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-indigo-500">₹{remainingGroupBudget.toLocaleString()}</h3>
            <FaCalculator className="text-indigo-500 text-xl" />
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${budgetUtilization}%` }} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Daily Target Spend</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-amber-500">₹{recommendation.expected_daily_spending?.toLocaleString()}</h3>
            <FaChartPie className="text-amber-500 text-xl" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            ₹{recommendation.average_cost_per_day_person?.toLocaleString()} / Person / Day
          </span>
        </div>
      </div>

      {/* 2. Room & Vehicle Allocations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Planning Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <FaBed className="text-sky-500" />
              <span>Smart Room Allocation</span>
            </h3>
            <span className="text-xs font-black text-sky-500 bg-sky-500/10 px-3 py-1 rounded-xl">
              {roomPlan.rooms_required} Rooms Needed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Beds</span>
              <span className="text-sm font-black text-slate-900 dark:text-white block">{roomPlan.beds_required} Beds</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Twin Sharing</span>
              <span className="text-sm font-black text-slate-900 dark:text-white block">{roomPlan.twin_sharing} Rooms</span>
            </div>

            {roomPlan.family_rooms > 0 && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Family Rooms</span>
                <span className="text-sm font-black text-slate-900 dark:text-white block">{roomPlan.family_rooms} Suites</span>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-1">
              <span className="text-[10px] font-extrabold text-sky-500 uppercase">Est. Hotel Cost</span>
              <span className="text-sm font-black text-sky-600 dark:text-sky-300 block">
                ₹{roomPlan.est_acc_cost?.toLocaleString()} ({groupState.days} Nights)
              </span>
            </div>
          </div>
        </div>

        {/* Transport Recommendation Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <FaBus className="text-indigo-500" />
              <span>Recommended Transport</span>
            </h3>
            <span className="text-xs font-black text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-xl">
              {transportPlan.category}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-300">
                {transportPlan.recommended_vehicle}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-indigo-500 text-white">
                Cap: {transportPlan.vehicle_capacity} Passengers
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
              Optimal group transit vehicle configured based on total headcount of {recommendation.total_travelers} travelers.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="font-bold text-slate-500 dark:text-slate-400">Est. Transport Total</span>
            <span className="font-black text-indigo-500 text-sm">₹{transportPlan.est_transport_cost?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 3. Expense Split & Member Balances Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <FaExchangeAlt className="text-emerald-500" />
            <span>Expense Splitting & Balance Sheet ({groupState.split_method})</span>
          </h3>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl">
            Auto Calculated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] font-black uppercase">
                <th className="pb-2">Traveler</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Individual Share</th>
                <th className="pb-2">Contribution</th>
                <th className="pb-2">Status / Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-800 dark:text-slate-200">
              {splitSummary.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 font-extrabold">{row.name}</td>
                  <td className="py-3 text-slate-400">{row.role}</td>
                  <td className="py-3 text-sky-500 font-bold">₹{row.share?.toLocaleString()}</td>
                  <td className="py-3 text-emerald-500 font-bold">₹{row.contribution?.toLocaleString()}</td>
                  <td className="py-3">
                    {row.pending > 0 ? (
                      <span className="text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg">
                        Pending: ₹{row.pending?.toLocaleString()}
                      </span>
                    ) : row.extra > 0 ? (
                      <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                        Extra: ₹{row.extra?.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Live Expense Tracker & Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Trip Expense Tracker */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <FaMoneyBillWave className="text-emerald-500" />
              <span>Real-Time Group Expense Tracker</span>
            </h3>

            <button
              type="button"
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 font-extrabold text-xs transition-all border border-emerald-500/20"
            >
              <FaPlus />
              <span>Log Trip Expense</span>
            </button>
          </div>

          {expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{exp.title}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                        {exp.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Paid By: <strong>{exp.paid_by}</strong> • Split: {exp.split_between}
                    </div>
                  </div>

                  <span className="font-black text-emerald-500 text-sm">₹{exp.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs font-semibold">
              No live expenses logged during trip yet. Click "Log Trip Expense" to track shared bills in real-time.
            </div>
          )}
        </div>

        {/* Emergency & Convenience Directory */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FaShieldAlt className="text-rose-500" />
            <span>Emergency Directory</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Helplines</span>
              <div className="space-y-1">
                {(emergencyDir.emergency_contacts || []).map((c, i) => (
                  <div key={i} className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>{c.service}:</span>
                    <span className="text-rose-500">{c.number}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Hospitals & Trauma</span>
              {(emergencyDir.hospitals || []).map((h, i) => (
                <div key={i} className="text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center space-x-1.5">
                  <FaHospital className="text-rose-400 shrink-0" />
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Log Trip Expense</h4>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  placeholder="e.g. Group Dinner at Baga Shack"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Accommodation">Hotel & Stay</option>
                    <option value="Transport">Cab & Transit</option>
                    <option value="Activities">Tickets & Sightseeing</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Paid By</label>
                <input
                  type="text"
                  value={expenseForm.paid_by}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paid_by: e.target.value })}
                  placeholder="e.g. Pranav"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingExpense}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-md"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDashboardView;
