import React from "react";
import { motion } from "framer-motion";
import { Droplets, Wind, Thermometer, MapPin } from "lucide-react";

export const WeatherCard = ({ data, unit }) => {
  if (!data) return null;

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  const { name, country, weather, temperature, humidity, wind } = data;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel p-8 w-full max-w-md mx-auto flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      <div className="flex items-center text-xl font-medium mb-2 space-x-2">
        <MapPin size={24} className="text-blue-300" />
        <h2>{name}, {country}</h2>
      </div>

      <div className="flex flex-col items-center justify-center my-4">
        <motion.img
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          src={weather.iconUrl}
          alt={weather.description}
          className="w-40 h-40 filter drop-shadow-xl"
        />
        <h1 className="text-6xl font-bold tracking-tighter mt-[-20px]">
          {temperature.current}{tempUnit}
        </h1>
        <p className="text-xl capitalize mt-2 text-blue-100/90 font-medium">
          {weather.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full mt-6 pt-6 border-t border-white/20">
        <div className="flex flex-col items-center">
          <Thermometer size={24} className="text-orange-300 mb-1" />
          <span className="text-sm font-semibold">{temperature.feels_like}{tempUnit}</span>
          <span className="text-xs text-gray-300 uppercase mt-1">Feels Like</span>
        </div>
        <div className="flex flex-col items-center border-l border-r border-white/20 px-2">
          <Droplets size={24} className="text-blue-300 mb-1" />
          <span className="text-sm font-semibold">{humidity}%</span>
          <span className="text-xs text-gray-300 uppercase mt-1">Humidity</span>
        </div>
        <div className="flex flex-col items-center">
          <Wind size={24} className="text-teal-300 mb-1" />
          <span className="text-sm font-semibold">{wind.speed}{speedUnit}</span>
          <span className="text-xs text-gray-300 uppercase mt-1">Wind</span>
        </div>
      </div>
    </motion.div>
  );
};
