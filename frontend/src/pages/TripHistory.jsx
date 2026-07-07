import React, { useState, useEffect } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import TripCard from "../components/TripCard";
import WeatherCard from "../components/WeatherCard";
import BudgetBreakdown from "../components/BudgetBreakdown";
import ItineraryTimeline from "../components/ItineraryTimeline";
import { FaHistory, FaTimes, FaUndo, FaWallet } from "react-icons/fa";
import toast from "react-hot-toast";

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

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

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
  };

  if (loading) return <LoadingSpinner size="lg" text="Retrieving your saved itineraries..." />;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Trip History</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review details of your saved itineraries.
        </p>
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
