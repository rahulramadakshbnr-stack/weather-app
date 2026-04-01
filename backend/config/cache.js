const NodeCache = require('node-cache');

// Standard Cache: Keep items for 10 minutes (600 seconds), check for expiry every 2 minutes
const weatherCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

module.exports = weatherCache;
