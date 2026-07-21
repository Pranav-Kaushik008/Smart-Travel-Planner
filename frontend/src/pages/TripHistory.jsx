import React, { useState, useEffect } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import TripCard from "../components/TripCard";
import WeatherCard from "../components/WeatherCard";
import BudgetBreakdown from "../components/BudgetBreakdown";
import ItineraryTimeline from "../components/ItineraryTimeline";
import { FaHistory, FaTimes, FaWallet, FaCheckCircle, FaReceipt, FaPen, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const EXPENSE_FIELDS = [
  { key: "actual_hotel", label: "🏨 Hotels & Stay", color: "sky" },
  { key: "actual_food", label: "🍽️ Food & Dining", color: "emerald" },
  { key: "actual_travel", label: "🚕 Transport & Travel", color: "amber" },
  { key: "actual_activities", label: "🎯 Activities & Tickets", color: "violet" },
  { key: "actual_misc", label: "🛍️ Shopping & Misc", color: "rose" },
];

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [expenseEditing, setExpenseEditing] = useState(null); // trip id being edited
  const [expenseForm, setExpenseForm] = useState({});
  const [savingExpense, setSavingExpense] = useState(false);

  const fetchTrips = async () => {
    try {
      const res = await api.get("/trip-history");
      setTrips(res.data);
    } catch (err) {
      console.error("Error fetching trip history", err);
      toast.error("Could not fetch trip history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      await api.delete(`/trips/${id}`);
      toast.success("Trip deleted");
      setTrips(trips.filter((t) => t.id !== id));
      if (selectedTrip && selectedTrip.id === id) {
        setSelectedTrip(null);
      }
    } catch (err) {
      console.error("Error deleting trip", err);
      toast.error("Failed to delete trip");
    }
  };

  const handleClearAllTrips = async () => {
    if (!window.confirm("Are you sure you want to clear your ENTIRE trip history? This cannot be undone.")) return;

    try {
      await api.delete("/clear-trip-history");
      toast.success("Trip history cleared successfully");
      setTrips([]);
      setSelectedTrip(null);
    } catch (err) {
      console.error("Error clearing trip history", err);
      toast.error("Failed to clear trip history");
    }
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setExpenseEditing(null);
  };

  // Start editing expenses for a trip
  const startExpenseEdit = (trip) => {
    setExpenseEditing(trip.id);
    setExpenseForm({
      actual_hotel: trip.actual_hotel ?? "",
      actual_food: trip.actual_food ?? "",
      actual_travel: trip.actual_travel ?? "",
      actual_activities: trip.actual_activities ?? "",
      actual_misc: trip.actual_misc ?? "",
    });
  };

  const handleExpenseChange = (key, value) => {
    // Allow empty string or valid number
    setExpenseForm((prev) => ({ ...prev, [key]: value }));
  };

  const computeExpenseTotal = () => {
    return EXPENSE_FIELDS.reduce((sum, f) => {
      const val = parseFloat(expenseForm[f.key]);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const handleSaveExpenses = async (tripId) => {
    setSavingExpense(true);
    try {
      const payload = {};
      EXPENSE_FIELDS.forEach((f) => {
        const val = parseFloat(expenseForm[f.key]);
        if (!isNaN(val)) payload[f.key] = val;
      });

      const res = await api.patch(`/trips/${tripId}/expenses`, payload);
      const updated = res.data;

      // Update local trips state
      setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(updated);
      }
      setExpenseEditing(null);
      toast.success("Expenses saved successfully!");
    } catch (err) {
      console.error("Error saving expenses", err);
      toast.error("Failed to save expenses");
    } finally {
      setSavingExpense(false);
    }
  };

  // Compute grand total across all trips
  const grandTotalActual = trips.reduce((sum, t) => sum + (t.actual_total || 0), 0);
  const tripsWithExpenses = trips.filter((t) => t.actual_total && t.actual_total > 0).length;

  if (loading) return <LoadingSpinner size="lg" text="Retrieving your saved itineraries..." />;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Trip History</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review saved itineraries and track your actual travel expenses.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {trips.length > 0 && (
            <button
              onClick={handleClearAllTrips}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-2xl transition-all border border-rose-500/20 flex items-center gap-1.5 shadow-xs"
            >
              <FaTrash className="text-xs" /> Clear All History
            </button>
          )}

          {/* Grand Total Expense Badge */}
          {grandTotalActual > 0 && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3.5 shadow-sm">
              <div className="p-2 bg-emerald-500/15 rounded-xl">
                <FaWallet className="text-emerald-500 text-lg" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Actual Spent</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{grandTotalActual.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">{tripsWithExpenses} of {trips.length} trips logged</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="text-center p-12 glass-panel rounded-3xl max-w-md mx-auto border border-slate-200 dark:border-slate-800">
          <FaHistory className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-2">No Saved Trips</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">
            You haven't saved any trips yet. Generate vacation predictions and save your favorites to view here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={handleDeleteTrip}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Details View Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
              <div>
                <h3 className="font-extrabold text-xl text-slate-805 dark:text-white">
                  Trip to {selectedTrip.destination}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 font-semibold mt-0.5">
                  Saved Plan Details ({selectedTrip.days} Days • {selectedTrip.season})
                </p>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <FaTimes className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Weather Stats at save time */}
              {(selectedTrip.weather_temp !== null) && (
                <WeatherCard
                  destination={selectedTrip.destination}
                  weather={{
                    temp: selectedTrip.weather_temp,
                    description: selectedTrip.weather_desc || "Clear",
                    humidity: selectedTrip.weather_humidity || 50,
                    wind_speed: selectedTrip.weather_wind_speed || 3.0,
                    feels_like: selectedTrip.weather_temp,
                    icon: null
                  }}
                />
              )}

              {/* Budget Details */}
              <BudgetBreakdown
                estimate={{
                  hotel_cost: selectedTrip.hotel_cost,
                  food_cost: selectedTrip.food_cost,
                  travel_cost: selectedTrip.travel_cost,
                  activity_cost: selectedTrip.activity_cost,
                  total_cost: selectedTrip.total_cost
                }}
              />

              {/* =============== EXPENSE TRACKER SECTION =============== */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500/5 via-sky-500/5 to-violet-500/5 px-6 py-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/15 rounded-xl">
                      <FaReceipt className="text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">Actual Expenses</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Log what you actually spent on this trip</p>
                    </div>
                  </div>
                  {expenseEditing !== selectedTrip.id && (
                    <button
                      onClick={() => startExpenseEdit(selectedTrip)}
                      className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all"
                    >
                      <FaPen className="text-[10px]" />
                      {selectedTrip.actual_total ? "Edit Expenses" : "Log Expenses"}
                    </button>
                  )}
                </div>

                {/* Expense Content */}
                <div className="p-6">
                  {expenseEditing === selectedTrip.id ? (
                    /* ====== EDIT MODE ====== */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EXPENSE_FIELDS.map((f) => (
                          <div key={f.key} className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{f.label}</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={expenseForm[f.key]}
                                onChange={(e) => handleExpenseChange(f.key, e.target.value)}
                                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Live Total */}
                      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500/5 to-sky-500/5 rounded-xl px-5 py-4 border border-emerald-500/15">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Running Total</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          ₹{computeExpenseTotal().toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Comparison with estimated budget */}
                      {selectedTrip.total_cost > 0 && (
                        <div className="text-xs text-slate-500 text-center">
                          {computeExpenseTotal() > selectedTrip.total_cost ? (
                            <span className="text-rose-500 font-bold">
                              ⚠️ Over budget by ₹{(computeExpenseTotal() - selectedTrip.total_cost).toLocaleString("en-IN")}
                            </span>
                          ) : (
                            <span className="text-emerald-500 font-bold">
                              ✅ Under budget by ₹{(selectedTrip.total_cost - computeExpenseTotal()).toLocaleString("en-IN")}
                            </span>
                          )}
                          {" "}(Estimated: ₹{selectedTrip.total_cost.toLocaleString("en-IN")})
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleSaveExpenses(selectedTrip.id)}
                          disabled={savingExpense}
                          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl font-bold text-sm shadow-md hover:from-emerald-600 hover:to-sky-600 disabled:opacity-60 transition-all"
                        >
                          <FaCheckCircle />
                          {savingExpense ? "Saving..." : "Save Expenses"}
                        </button>
                        <button
                          onClick={() => setExpenseEditing(null)}
                          className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : selectedTrip.actual_total ? (
                    /* ====== VIEW MODE (has expenses logged) ====== */
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {EXPENSE_FIELDS.map((f) => {
                          const val = selectedTrip[f.key];
                          if (!val && val !== 0) return null;
                          return (
                            <div key={f.key} className={`p-3.5 bg-${f.color}-500/5 border border-${f.color}-500/10 rounded-xl`}>
                              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{f.label}</div>
                              <div className={`text-lg font-black text-${f.color}-600 dark:text-${f.color}-400 mt-1`}>
                                ₹{val.toLocaleString("en-IN")}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total & Comparison */}
                      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500/8 to-sky-500/8 rounded-xl px-5 py-4 border border-emerald-500/15">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Actual Total Spent</div>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                            ₹{selectedTrip.actual_total.toLocaleString("en-IN")}
                          </div>
                        </div>
                        {selectedTrip.total_cost > 0 && (
                          <div className="text-right">
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">vs Estimated</div>
                            <div className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                              ₹{selectedTrip.total_cost.toLocaleString("en-IN")}
                            </div>
                            <div className={`text-xs font-bold mt-0.5 ${selectedTrip.actual_total > selectedTrip.total_cost ? "text-rose-500" : "text-emerald-500"}`}>
                              {selectedTrip.actual_total > selectedTrip.total_cost
                                ? `↑ ₹${(selectedTrip.actual_total - selectedTrip.total_cost).toLocaleString("en-IN")} over`
                                : `↓ ₹${(selectedTrip.total_cost - selectedTrip.actual_total).toLocaleString("en-IN")} under`}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* ====== EMPTY STATE ====== */
                    <div className="text-center py-8 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                        <FaWallet className="text-slate-400 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-700 dark:text-white">No Expenses Logged Yet</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          After completing your trip, log your actual spending to compare against the estimated budget.
                        </p>
                      </div>
                      <button
                        onClick={() => startExpenseEdit(selectedTrip)}
                        className="px-5 py-2.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl font-bold text-xs hover:bg-sky-500/20 transition-all inline-flex items-center gap-2"
                      >
                        <FaPen className="text-[10px]" /> Start Logging Expenses
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Day wise calendar plan */}
              {selectedTrip.itinerary ? (
                <ItineraryTimeline itinerary={selectedTrip.itinerary} />
              ) : (
                <div className="p-8 text-center bg-slate-500/5 rounded-2xl border border-slate-200/10">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No day-wise itinerary generated for this trip plan.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex justify-end">
              <button
                onClick={() => setSelectedTrip(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripHistory;
