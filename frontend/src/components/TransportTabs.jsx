import React, { useState } from "react";
import { FaPlane, FaTrain, FaBus, FaExclamationTriangle, FaRedo, FaInfoCircle } from "react-icons/fa";
import FlightCard from "./FlightCard";
import TrainCard from "./TrainCard";
import BusCard from "./BusCard";

const tabs = [
  { 
    key: "flights", 
    label: "Flights", 
    icon: FaPlane, 
    activeGradient: "from-sky-500 to-blue-600",
    badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-400"
  },
  { 
    key: "trains", 
    label: "Trains", 
    icon: FaTrain, 
    activeGradient: "from-indigo-500 to-purple-600",
    badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
  },
  { 
    key: "buses", 
    label: "Buses", 
    icon: FaBus, 
    activeGradient: "from-rose-500 to-red-600",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400"
  },
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
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-8">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 dark:text-slate-500 text-2xl mb-3">
      <Icon />
    </div>
    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{message}</p>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Check back later or try adjusting travel dates.</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center glass-panel rounded-3xl border border-red-200/50 dark:border-red-900/30 p-8">
    <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 text-2xl mb-3">
      <FaExclamationTriangle />
    </div>
    <p className="text-sm font-bold text-red-600 dark:text-red-400">{message || "Unable to load transit data."}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
      >
        <FaRedo className="text-[10px]" /> Retry Search
      </button>
    )}
  </div>
);

const TransportTabs = ({
  flights = [],
  trains = [],
  buses = [],
  loadingFlights = false,
  loadingTrains = false,
  loadingBuses = false,
  errors = {},
  airportNote = null,
  trainTransitNote = null,
  busTransitNote = null,
}) => {
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

  return (
    <div className="space-y-6">
      {/* 1. TOP SEGMENTED TAB SWITCHER */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = counts[tab.key];
          const loading = isLoading[tab.key];

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${tab.activeGradient} text-white shadow-md shadow-indigo-500/10`
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className="text-sm shrink-0" />
              <span className="truncate">{tab.label}</span>

              {/* Counter Pill */}
              {!loading && count > 0 && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {count}
                </span>
              )}

              {/* Loading Spinner */}
              {loading && (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. ISOLATED TAB CONTENT CONTAINER */}
      <div className="space-y-4">
        {/* FLIGHTS TAB CONTENT */}
        {activeTab === "flights" && (
          <div className="space-y-4">
            {/* Flight Routing Info Banner */}
            {airportNote && (
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-xs text-sky-900 dark:text-sky-200 shadow-xs flex items-start gap-3">
                <FaInfoCircle className="text-sky-500 text-base mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold uppercase tracking-wider text-[10px] block text-sky-600 dark:text-sky-400 mb-0.5">
                    Airport Routing Notice
                  </span>
                  {airportNote}
                </div>
              </div>
            )}

            {/* Flight Cards List */}
            {loadingFlights ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : errors.flights ? (
              <ErrorState message={errors.flights} />
            ) : flights.length === 0 ? (
              <EmptyState icon={FaPlane} message="No flight offers available for this route." />
            ) : (
              <div className="space-y-4">
                {flights.map((flight, idx) => (
                  <FlightCard key={flight.flight_number || idx} flight={flight} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRAINS TAB CONTENT */}
        {activeTab === "trains" && (
          <div className="space-y-4">
            {/* Train Hub Info Banner */}
            {trainTransitNote && (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-xs text-indigo-900 dark:text-indigo-200 shadow-xs flex items-start gap-3">
                <FaInfoCircle className="text-indigo-500 text-base mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold uppercase tracking-wider text-[10px] block text-indigo-600 dark:text-indigo-400 mb-0.5">
                    Railway Station Hub Notice
                  </span>
                  {trainTransitNote}
                </div>
              </div>
            )}

            {/* Train Cards List */}
            {loadingTrains ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : errors.trains ? (
              <ErrorState message={errors.trains} />
            ) : trains.length === 0 ? (
              <EmptyState icon={FaTrain} message="No direct train connections found." />
            ) : (
              <div className="space-y-4">
                {trains.map((train, idx) => (
                  <TrainCard key={train.train_number || idx} train={train} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* BUSES TAB CONTENT */}
        {activeTab === "buses" && (
          <div className="space-y-4">
            {/* Bus Routing Info Banner */}
            {busTransitNote && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-900 dark:text-rose-200 shadow-xs flex items-start gap-3">
                <FaInfoCircle className="text-rose-500 text-base mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold uppercase tracking-wider text-[10px] block text-rose-600 dark:text-rose-400 mb-0.5">
                    Bus Connectivity Notice
                  </span>
                  {busTransitNote}
                </div>
              </div>
            )}

            {/* Bus Cards List */}
            {loadingBuses ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : errors.buses ? (
              <ErrorState message={errors.buses} />
            ) : buses.length === 0 ? (
              <EmptyState icon={FaBus} message="No bus operators available for this route." />
            ) : (
              <div className="space-y-4">
                {buses.map((bus, idx) => (
                  <BusCard key={bus.operator + idx} bus={bus} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportTabs;
