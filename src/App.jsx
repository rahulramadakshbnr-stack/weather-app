import React, { useEffect, useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import { ForecastList } from "./components/ForecastList";
import { Loader, ErrorMessage } from "./components/Loader";
import { useWeather } from "./hooks/useWeather";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const { weatherData, forecastData, loading, error, unit, getWeatherByCity, getWeatherByLocation, toggleUnit } = useWeather();
  const [bgClass, setBgClass] = useState("bg-gradient-to-br from-blue-900 to-indigo-900"); // default dark blue

  useEffect(() => {
    // Attempt geolocation on initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherByLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // If denied or error, fallback to a default city
          console.log("Geolocation error:", error);
          getWeatherByCity("New York");
        }
      );
    } else {
      getWeatherByCity("New York");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (weatherData && weatherData.weather) {
      const condition = weatherData.weather.condition.toLowerCase();
      // Update background based on condition
      if (condition.includes("clear")) {
        setBgClass("bg-gradient-to-br from-blue-400 to-cyan-400");
      } else if (condition.includes("cloud")) {
        setBgClass("bg-gradient-to-br from-gray-500 to-gray-700");
      } else if (condition.includes("rain") || condition.includes("drizzle")) {
        setBgClass("bg-gradient-to-br from-slate-700 to-blue-900");
      } else if (condition.includes("thunderstorm")) {
        setBgClass("bg-gradient-to-br from-indigo-900 to-purple-900");
      } else if (condition.includes("snow")) {
        setBgClass("bg-gradient-to-br from-blue-100 to-blue-300");
      } else {
        setBgClass("bg-gradient-to-br from-blue-800 to-indigo-900");
      }
    }
  }, [weatherData]);

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherByLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          alert("Unable to retrieve your location. Please check your browser settings.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 ease-in-out ${bgClass} py-8 px-4 flex flex-col`}>
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center mb-8 px-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 drop-shadow-sm flex items-center">
          <span className="mr-2 text-white">🌤️</span>
          Atmosphere
        </h1>
        <button
          onClick={toggleUnit}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-full border border-white/20 font-medium text-sm flex items-center space-x-1 shadow-md"
        >
          <span className={unit === "metric" ? "text-white" : "text-gray-400"}>°C</span>
          <span className="text-gray-400">|</span>
          <span className={unit === "imperial" ? "text-white" : "text-gray-400"}>°F</span>
        </button>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col items-center">
        <SearchBar onSearch={getWeatherByCity} onLocation={handleLocationSearch} />

        <div className="w-full min-h-[300px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <Loader />
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <ErrorMessage message={error} />
              </motion.div>
            )}

            {weatherData && !loading && !error && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <WeatherCard data={weatherData} unit={unit} />
                <ForecastList forecastData={forecastData} unit={unit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto text-center mt-12 text-sm text-white/50 pb-4">
        <p>Built with React & Framer Motion</p>
        <p className="mt-1">Data provided by OpenWeatherMap</p>
      </footer>
    </div>
  );
}

export default App;
