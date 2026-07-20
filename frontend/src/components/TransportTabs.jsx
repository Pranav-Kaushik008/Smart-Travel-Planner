import React, { useState } from "react";
import { FaPlane, FaTrain, FaBus, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import FlightCard from "./FlightCard";
import TrainCard from "./TrainCard";
import BusCard from "./BusCard";

const tabs = [
  { key: "flights", label: "Flights", icon: FaPlane, color: "sky" },
  { key: "trains", label: "Trains", icon: FaTrain, color: "indigo" },
  { key: "buses", label: "Buses", icon: FaBus, color: "rose" },
];

const CardSkeleton = () => (
  <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" />
      </div>
      <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-24" />
      <div className="space-y-1">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" />
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-20" />
      <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-28" />
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 dark:text-slate-600 text-2xl mb-4">
      <Icon />
    </div>
    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{message}</p>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try a different destination or check back later.</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 text-2xl mb-4">
      <FaExclamationTriangle />
    </div>
    <p className="text-sm font-bold text-red-600 dark:text-red-400">{message || "Something went wrong."}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
      >
        <FaRedo className="text-[10px]" /> Retry
      </button>
    )}
  </div>
);

const TransportTabs = ({ flights = [], trains = [], buses = [], loadingFlights, loadingTrains, loadingBuses, errors = {}, airportNote = null }) => {
  const [activeTab, setActiveTab] = useState("flights");

  const counts = {
    flights: flights.length,
    trains: trains.length,
    buses: buses.length,
  };

  const isLoading = {
    flights: loadingFlights,
    trains: loadingTrains,
    buses: loadingBuses,
  };

  const renderContent = () => {
    const loading = isLoading[activeTab];
    const error = errors[activeTab];

    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    if (activeTab === "flights") {
      if (flights.length === 0) return <EmptyState icon={FaPlane} message="No flights found for this route." />;
      return (
        <div className="space-y-4">
          {flights.map((flight, idx) => (
            <FlightCard key={flight.flight_number || idx} flight={flight} airportNote={airportNote} />
          ))}
        </div>
      );
    }

    if (activeTab === "trains") {
      if (trains.length === 0) return <EmptyState icon={FaTrain} message="No trains found for this route." />;
      return (
        <div className="space-y-4">
          {trains.map((train, idx) => (
            <TrainCard key={train.train_number || idx} train={train} />
          ))}
        </div>
      );
    }

    if (activeTab === "buses") {
      if (buses.length === 0) return <EmptyState icon={FaBus} message="No buses found for this route." />;
      return (
        <div className="space-y-4">
          {buses.map((bus, idx) => (
            <BusCard key={bus.operator + idx} bus={bus} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-5">
      {/* Airport information note */}
      {airportNote && (
        <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/90 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-200 shadow-sm">
          <span className="font-semibold">Flight notes:</span> {airportNote}
        </div>
      )}
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1.5 bg-slate-100/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const colorMap = { sky: "text-sky-500", indigo: "text-indigo-500", rose: "text-rose-500" };
          const bgColorMap = { sky: "bg-sky-500/10 text-sky-500", indigo: "bg-indigo-500/10 text-indigo-500", rose: "bg-rose-500/10 text-rose-500" };
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/40"
              }`}
            >
              <Icon className={`text-sm ${isActive ? colorMap[tab.color] : ""}`} />
              <span>{tab.label}</span>
              {!isLoading[tab.key] && counts[tab.key] > 0 && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  isActive ? bgColorMap[tab.color] : "bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }`}>
                  {counts[tab.key]}
                </span>
              )}
              {isLoading[tab.key] && (
                <div className="w-3 h-3 border-2 border-slate-300 dark:border-slate-600 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default TransportTabs;
