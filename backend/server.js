const dotenv = require('dotenv');

// Load variables BEFORE configuring any application modules!
dotenv.config();

const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    logger.info(`✅ Server is running securely on http://localhost:${PORT}`);
    logger.info(`👉 Mode: ${process.env.NODE_ENV || 'production'}`);
});

// Handle Unexpected Process exceptions
process.on('unhandledRejection', (err) => {
    logger.error('💥 UNHANDLED REJECTION! Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});
