import { useState, useEffect, useCallback } from "react";
import { fetchWeatherData, fetchForecastData } from "../utils/api";

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // metric (Celsius) or imperial (Fahrenheit)

  const getWeatherByLocation = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, forecast] = await Promise.all([
        fetchWeatherData({ lat, lon, units: unit }),
        fetchForecastData({ lat, lon, units: unit }),
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
         setError(err.response.data.message);
      } else {
         setError(err.message || "Failed to fetch weather data.");
      }
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const getWeatherByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, forecast] = await Promise.all([
        fetchWeatherData({ q: city, units: unit }),
        fetchForecastData({ q: city, units: unit }),
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
         setError(err.response.data.message);
      } else {
         setError(err.message || "Failed to fetch weather data.");
      }
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  useEffect(() => {
    if (weatherData) {
      // Re-fetch with new unit
      if (weatherData.name) {
        getWeatherByCity(weatherData.name);
      } else if (weatherData.coord) {
        getWeatherByLocation(weatherData.coord.lat, weatherData.coord.lon);
      }
    }
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    weatherData,
    forecastData,
    loading,
    error,
    unit,
    getWeatherByCity,
    getWeatherByLocation,
    toggleUnit,
  };
};
