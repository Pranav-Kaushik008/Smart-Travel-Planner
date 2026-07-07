import React from "react";
import { FaTemperatureHigh, FaWind, FaCloud, FaTint } from "react-icons/fa";

const WeatherCard = ({ destination, weather }) => {
  if (!weather) return null;

  const iconUrl = weather.icon 
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
        <FaCloud className="mr-2 text-sky-500" /> Current Weather in {destination}
      </h3>
      
      <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          {iconUrl ? (
            <img 
              src={iconUrl} 
              alt={weather.description} 
              className="w-16 h-16 bg-sky-500/10 rounded-2xl" 
            />
          ) : (
            <div className="w-16 h-16 bg-sky-500/10 flex items-center justify-center rounded-2xl">
              <FaCloud className="w-8 h-8 text-sky-500 animate-bounce" />
            </div>
          )}
          <div>
            <h4 className="text-4xl font-extrabold text-slate-800 dark:text-white">
              {Math.round(weather.temp)}°C
            </h4>
            <p className="text-sm font-semibold capitalize text-slate-500 dark:text-slate-400 mt-1">
              {weather.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full md:w-auto md:border-l border-slate-200 dark:border-slate-800 md:pl-8">
          <div className="text-center md:text-left">
            <span className="flex items-center justify-center md:justify-start text-xs text-slate-500 dark:text-slate-400 mb-1">
              <FaTemperatureHigh className="mr-1 text-amber-500" /> Feels Like
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-white">
              {Math.round(weather.feels_like || weather.temp)}°C
            </span>
          </div>

          <div className="text-center md:text-left">
            <span className="flex items-center justify-center md:justify-start text-xs text-slate-500 dark:text-slate-400 mb-1">
              <FaTint className="mr-1 text-sky-500" /> Humidity
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-white">
              {weather.humidity}%
            </span>
          </div>

          <div className="text-center md:text-left">
            <span className="flex items-center justify-center md:justify-start text-xs text-slate-500 dark:text-slate-400 mb-1">
              <FaWind className="mr-1 text-teal-500" /> Wind
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-white">
              {weather.wind_speed} m/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
