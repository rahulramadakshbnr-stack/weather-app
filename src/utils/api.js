import axios from "axios";

// Using our Express backend!
const BASE_URL = "http://localhost:5000/api/weather";

export const fetchWeatherData = async (params) => {
  // Extract parameters and choose the right endpoint 
  const endpoint = (params.lat && params.lon) ? `${BASE_URL}/location` : `${BASE_URL}/current`;
  
  const queryParams = {
    unit: params.units,
  };

  if (params.lat && params.lon) {
      queryParams.lat = params.lat;
      queryParams.lon = params.lon;
  } else if (params.q) {
      queryParams.city = params.q;
  }

  const response = await axios.get(endpoint, {
    params: queryParams,
  });

  // Depending on `/location` vs `/current`, data might be nested inside `.data.current`
  // We handle that to safely return it back to `useWeather` hooks:
  return response.data.data.current ? response.data.data.current : response.data.data;
};

export const fetchForecastData = async (params) => {
  // If fetching by location, we already get forecast from `/location` parallel fetch, but `useWeather` hook calls both.
  // To avoid duplicate code, we can just call `/forecast`
  const endpoint = `${BASE_URL}/forecast`;

  const queryParams = {
    unit: params.units,
  };

  if (params.lat && params.lon) {
      queryParams.lat = params.lat;
      queryParams.lon = params.lon;
  } else if (params.q) {
      queryParams.city = params.q;
  }

  const response = await axios.get(endpoint, {
    params: queryParams,
  });
  
  return response.data.data;
};
