const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');

// Load error middleware
const errorHandler = require('./middleware/errorHandler');

// Load API routes
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS securely (In prod, specify the exact domain)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request payload parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compress all responses
app.use(compression());

// Development Logger using Morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiter
// Limit each IP to 100 requests per window (15 mins)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true, 
    legacyHeaders: false
});
app.use('/api/', apiLimiter);


// Setup Routes
app.use('/api/weather', weatherRoutes);


// Base route check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Weather API Backend is Running 🌤️' });
});


// Add the Custom Error Handler
app.use(errorHandler);

module.exports = app;
