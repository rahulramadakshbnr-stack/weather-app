const weatherService = require('../services/weatherService');
const logger = require('../config/logger');

exports.getCurrentWeather = async (req, res, next) => {
    try {
        const { city, unit } = req.query;
        if (!city) {
            return res.status(400).json({ success: false, message: 'City parameter is required.' });
        }
        const data = await weatherService.fetchCurrentWeather({ city, unit });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

exports.getForecast = async (req, res, next) => {
    try {
        const { city, unit } = req.query;
        if (!city) {
            return res.status(400).json({ success: false, message: 'City parameter is required.' });
        }
        const data = await weatherService.fetchForecast({ city, unit });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

exports.getWeatherByLocation = async (req, res, next) => {
    try {
        const { lat, lon, unit } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: 'Latitude (lat) and Longitude (lon) parameters are required.' });
        }
        
        // Parallel fetching for Current Weather and Forecast to optimize delivery!
        const [currentWeather, forecast] = await Promise.all([
            weatherService.fetchCurrentWeather({ lat, lon, unit }),
            weatherService.fetchForecast({ lat, lon, unit })
        ]);
        
        res.json({ 
            success: true, 
            data: { 
                current: currentWeather, 
                forecast: forecast 
            } 
        });
    } catch (error) {
        next(error);
    }
};
