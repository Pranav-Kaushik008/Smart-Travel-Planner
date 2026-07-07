import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import WeatherCard from "../components/WeatherCard";
import HotelCard from "../components/HotelCard";
import BudgetBreakdown from "../components/BudgetBreakdown";
import ItineraryTimeline from "../components/ItineraryTimeline";
import { TRAVEL_TYPES, SEASONS, DESTINATION_COVERS } from "../utils/constants";
import { FaPlane, FaCalendarCheck, FaMagic, FaFolderPlus, FaUndo } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TravelPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [travelType, setTravelType] = useState("");
  const [season, setSeason] = useState("");

  // Plan result states
  const [recommendation, setRecommendation] = useState(null);
  const [itinerary, setItinerary] = useState("");
  
  // Loading states
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);

  const handleGetRecommendation = async (e) => {
    e.preventDefault();
    if (!budget || !days || !travelType || !season) {
      toast.error("Please fill in all preferences");
      return;
    }

    setRecommendation(null);
    setItinerary("");
    setLoadingRecommendation(true);

    try {
      const res = await api.post("/recommend", {
        budget: Number(budget),
        days: Number(days),
        travel_type: travelType,
        season: season
      });
      setRecommendation(res.data);
      toast.success("Destination found!");
    } catch (err) {
      console.error("Error fetching recommendation", err);
      toast.error("Could not generate recommendation. Please try again.");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const handleGenerateItinerary = async () => {
    if (!recommendation) return;

    setLoadingItinerary(true);
    try {
      const res = await api.post("/generate-itinerary", {
        destination: recommendation.destination,
        days: Number(days),
        travel_type: travelType,
        budget: Number(budget)
      });
      setItinerary(res.data.itinerary);
      toast.success("AI Itinerary Generated!");
    } catch (err) {
      console.error("Error generating itinerary", err);
      toast.error("AI Generation failed. Fallback loaded.");
    } finally {
      setLoadingItinerary(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!recommendation) return;

    setSavingTrip(true);
    try {
      const data = {
        destination: recommendation.destination,
        budget: Number(budget),
        days: Number(days),
        travel_type: travelType,
        season: season,
        weather_temp: recommendation.weather?.temp || null,
        weather_desc: recommendation.weather?.description || null,
        weather_humidity: recommendation.weather?.humidity || null,
        weather_wind_speed: recommendation.weather?.wind_speed || null,
        itinerary: itinerary || null,
        hotel_cost: recommendation.budget_estimate?.hotel_cost || 0.0,
        food_cost: recommendation.budget_estimate?.food_cost || 0.0,
        travel_cost: recommendation.budget_estimate?.travel_cost || 0.0,
        activity_cost: recommendation.budget_estimate?.activity_cost || 0.0,
        total_cost: recommendation.budget_estimate?.total_cost || Number(budget)
      };

      await api.post("/save-trip", data);
      toast.success("Trip saved to your profile!");
      navigate("/history");
    } catch (err) {
      console.error("Error saving trip", err);
      toast.error("Could not save trip. Try again.");
    } finally {
      setSavingTrip(false);
    }
  };

  const resetPlanner = () => {
    setRecommendation(null);
    setItinerary("");
    setBudget("");
    setDays("");
    setTravelType("");
    setSeason("");
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">AI Travel Planner</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tell us your budget and timeframe; our recommendation engine does the rest.
        </p>
      </div>

      {!recommendation && !loadingRecommendation && (
        <form onSubmit={handleGetRecommendation} className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1.5 pl-1">
                Trip Budget (INR) *
              </label>
              <input
                type="number"
                placeholder="e.g. 20000"
                min="1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1.5 pl-1">
                Duration (Days) *
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1.5 pl-1">
                Travel Style *
              </label>
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
              >
                <option value="">Select Category</option>
                {TRAVEL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1.5 pl-1">
                Season *
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden rounded-2xl text-sm font-semibold transition-all"
              >
                <option value="">Select Season</option>
                {SEASONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            <FaPlane className="w-4 h-4 animate-bounce" />
            <span>Generate Travel Plan</span>
          </button>
        </form>
      )}

      {loadingRecommendation && (
        <LoadingSpinner size="lg" text="Analyzing destinations using RandomForest classifier model..." />
      )}

      {/* Plan Results Panel */}
      {recommendation && (
        <div className="space-y-8 animate-fadeIn">
          {/* Hero Banner */}
          <div className="relative h-72 rounded-3xl overflow-hidden shadow-md flex items-end">
            <img
              src={DESTINATION_COVERS[recommendation.destination] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"}
              alt={recommendation.destination}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="relative p-6 md:p-10 w-full flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0 z-10">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full">
                  Recommended Destination
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-3">
                  {recommendation.destination}
                </h1>
                <p className="text-sm text-slate-300 font-semibold mt-1">
                  Matched based on your {travelType} preferences during {season}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={resetPlanner}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-white/15"
                >
                  <FaUndo className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>
                <button
                  onClick={handleSaveTrip}
                  disabled={savingTrip}
                  className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md disabled:opacity-50"
                >
                  <FaFolderPlus className="w-3.5 h-3.5" />
                  <span>{savingTrip ? "Saving..." : "Save Trip"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Weather and Budget */}
            <div className="lg:col-span-2 space-y-8">
              <WeatherCard destination={recommendation.destination} weather={recommendation.weather} />
              <BudgetBreakdown estimate={recommendation.budget_estimate} />
            </div>

            {/* Right Column: AI Itinerary trigger */}
            <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center text-center space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-500">
                <FaMagic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Generate AI Itinerary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Use Google Gemini to build a custom day-by-day vacation roadmap with restaurant reviews, local activities, and tips.
                </p>
              </div>
              
              {!itinerary && !loadingItinerary && (
                <button
                  onClick={handleGenerateItinerary}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/15"
                >
                  Generate Day-Wise Plan
                </button>
              )}

              {loadingItinerary && (
                <div className="py-4">
                  <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Creating calendar timeline...</span>
                </div>
              )}

              {itinerary && (
                <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-emerald-500/10">
                  <FaCalendarCheck className="w-4 h-4" />
                  <span>Itinerary Generated Successfully!</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline displays here once generated */}
          {itinerary && (
            <ItineraryTimeline itinerary={itinerary} />
          )}

          {/* Hotels recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Highly Rated Hotels in {recommendation.destination}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendation.hotels.map((hotel) => (
                <HotelCard key={hotel.id || hotel.name} hotel={hotel} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPlanner;
