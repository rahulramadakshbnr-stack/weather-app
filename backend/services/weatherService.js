const axios = require('axios');
const API_URL = 'https://api.openweathermap.org/data/2.5';
const cache = require('../config/cache');
const logger = require('../config/logger');

// Retrieve API Context safely
const getApiKey = () => {
    if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
        logger.error('API key missing or invalid');
        throw { status: 500, message: 'Internal Server Configuration Error: Missing API Key' };
    }
    return process.env.OPENWEATHER_API_KEY;
};

// Formats Current Weather
const processCurrentWeather = (data, unit) => {
    const tempUnit = unit === 'metric' ? 'C' : 'F';
    const speedUnit = unit === 'metric' ? 'm/s' : 'mph';
    return {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        coordinates: { lat: data.coord.lat, lon: data.coord.lon },
        weather: {
            condition: data.weather[0].main,
            description: data.weather[0].description,
            iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
        },
        temperature: {
            current: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            min: Math.round(data.main.temp_min),
            max: Math.round(data.main.temp_max),
            unit: tempUnit
        },
        humidity: data.main.humidity,
        wind: { speed: data.wind.speed, unit: speedUnit },
        sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(data.sys.sunset * 1000).toISOString(),
    };
};

// Formats Forecast Weather
const processForecastWeather = (data, unit) => {
    const tempUnit = unit === 'metric' ? 'C' : 'F';
    // Get noon forecasts to simplify data block (1 item per day)
    const dailyForecast = data.list.filter(reading => reading.dt_txt.includes("12:00:00")).map(item => ({
        date: new Date(item.dt * 1000).toISOString(),
        temperature: {
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max),
            unit: tempUnit
        },
        weather: {
            condition: item.weather[0].main,
            description: item.weather[0].description,
            iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        }
    }));

    return {
        city: {
            name: data.city.name,
            country: data.city.country,
        },
        forecasts: dailyForecast
    };
};


exports.fetchCurrentWeather = async ({ city, lat, lon, unit = 'metric' }) => {
    // Generate valid cache key
    const cacheKey = `weather_${city || `${lat}_${lon}`}_${unit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        logger.info(`[CACHE HIT] Current weather config: ${cacheKey}`);
        return cachedData;
    }

    const params = { appid: getApiKey(), units: unit };
    if (city) {
        params.q = city;
    } else if (lat && lon) {
        params.lat = lat;
        params.lon = lon;
    }

    const response = await axios.get(`${API_URL}/weather`, { params });
    const processedData = processCurrentWeather(response.data, unit);
    
    // Save to Cache (5 mins / 300 seconds default, actually node-cache config defaults to 600)
    cache.set(cacheKey, processedData);
    logger.info(`[API CALL] Fetched current weather configure: ${cacheKey}`);

    return processedData;
};

exports.fetchForecast = async ({ city, lat, lon, unit = 'metric' }) => {
    // Generate valid cache key
    const cacheKey = `forecast_${city || `${lat}_${lon}`}_${unit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        logger.info(`[CACHE HIT] Forecast config: ${cacheKey}`);
        return cachedData;
    }

    const params = { appid: getApiKey(), units: unit };
    if (city) {
        params.q = city;
    } else if (lat && lon) {
        params.lat = lat;
        params.lon = lon;
    }

    const response = await axios.get(`${API_URL}/forecast`, { params });
    const processedData = processForecastWeather(response.data, unit);
    
    cache.set(cacheKey, processedData);
    logger.info(`[API CALL] Fetched forecast config: ${cacheKey}`);
    
    return processedData;
};
