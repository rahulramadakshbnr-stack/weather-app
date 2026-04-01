const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// GET /api/weather/current?city={cityName}&unit={metric/imperial}
router.get('/current', weatherController.getCurrentWeather);

// GET /api/weather/forecast?city={cityName}&unit={metric/imperial}
router.get('/forecast', weatherController.getForecast);

// GET /api/weather/location?lat={lat}&lon={lon}&unit={metric/imperial}
router.get('/location', weatherController.getWeatherByLocation);

module.exports = router;
