import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export const ForecastList = ({ forecastData, unit }) => {
  if (!forecastData || !forecastData.forecasts) return null;

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <span className="bg-white/20 p-2 rounded-lg mr-3">📅</span>
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecastData.forecasts.map((item, index) => {
          const date = new Date(item.date);
          
          return (
            <motion.div
              key={item.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="glass-panel p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
            >
              <h4 className="text-sm font-medium text-gray-200">
                {format(date, "EEE")}
              </h4>
              <span className="text-xs text-gray-400">{format(date, "MMM d")}</span>
              
              <img
                src={item.weather.iconUrl}
                alt={item.weather.description}
                className="w-16 h-16 drop-shadow-md my-2"
              />
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-bold">{item.temperature.max}°</span>
                <span className="text-gray-400">{item.temperature.min}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
