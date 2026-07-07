import React from "react";
import { Link } from "react-router-dom";
import { FaCompass, FaBrain, FaCloudSun, FaWallet, FaArrowRight, FaHotel, FaHistory } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "ML Recommendation",
      desc: "Our trained Random Forest classifier recommends the ultimate holiday destination matching your specific budget, days, travel type, and season.",
      icon: <FaBrain className="w-6 h-6 text-sky-500" />
    },
    {
      title: "Real-Time Weather",
      desc: "Get real-time temperatures, wind speeds, humidity metrics, and descriptions for recommended cities straight from OpenWeather API.",
      icon: <FaCloudSun className="w-6 h-6 text-emerald-500" />
    },
    {
      title: "AI Day-Wise Itineraries",
      desc: "Dynamically generate detailed plans specifying attractions, daily activities, travel tips, and dining reviews via Google Gemini API.",
      icon: <FaCompass className="w-6 h-6 text-indigo-500" />
    },
    {
      title: "Budget Estimator",
      desc: "Break down estimated costs into distinct categories (Lodging, Food, Transit, and Activities) using our heuristic calculations.",
      icon: <FaWallet className="w-6 h-6 text-amber-500" />
    },
    {
      title: "Local Hotel Finder",
      desc: "Explore highly-rated hotel listings with live pricing, reviews, and amenities matching your recommended travel city.",
      icon: <FaHotel className="w-6 h-6 text-rose-500" />
    },
    {
      title: "Personal Dashboard",
      desc: "Keep records of all generated itineraries and access interactive Recharts analytics describing your travel habits.",
      icon: <FaHistory className="w-6 h-6 text-violet-500" />
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero section */}
      <section className="relative overflow-hidden py-20 lg:py-32 flex items-center justify-center border-b border-slate-200/50 dark:border-slate-800/50">
        {/* Animated backdrop */}
        <div className="absolute inset-0 -z-10 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <FaCompass className="w-3.5 h-3.5 animate-spin" />
            <span>Next-Generation Travel Planner</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
            Plan Your Next Adventure With{" "}
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-teal-500 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Input your budget, timeframe, and vacation preferences. Our machine learning recommendation engine finds the perfect city, downloads real-time weather, and drafts a custom itinerary.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {user ? (
              <Link
                to="/planner"
                className="flex items-center space-x-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                <span>Go to Travel Planner</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  <span>Get Started for Free</span>
                  <FaArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-2xl border border-slate-300 dark:border-slate-800 transition-all"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">
              Features Packed for Travelers
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              An all-in-one smart travel planning portal combining modern Machine Learning models and Generative AI helpers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-slate-500/5 dark:bg-white/5 rounded-2xl w-fit mb-5">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-slate-500 dark:text-slate-450 text-xs font-semibold">
          <p>© 2026 AI Smart Travel Planner. Built for production deployment.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-sky-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
