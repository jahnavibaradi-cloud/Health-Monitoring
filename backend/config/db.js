const mongoose = require('mongoose');
const redis = require('redis');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/health-monitoring');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Track connection state
let redisConnected = false;
let redisClient = null;

const initRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 2) {
            console.warn('Redis: max retries reached, disabling caching');
            redisConnected = false;
            return false; // Stop reconnecting
          }
          return Math.min(retries * 500, 2000);
        }
      }
    });

    redisClient.on('error', () => {}); // Suppress repeated error logs
    redisClient.on('connect', () => {
      console.log('Redis Connected');
      redisConnected = true;
    });

    await redisClient.connect();
    redisConnected = true;
  } catch (err) {
    console.warn('Redis not available, caching disabled');
    redisConnected = false;
  }
};

// Initialize Redis immediately
initRedis();

const exported = {
  connectDB,
  isRedisConnected: () => redisConnected,
};

// Use defineProperty so healthController always gets the current redisClient reference
Object.defineProperty(exported, 'redisClient', {
  get: () => redisClient,
  enumerable: true,
});

module.exports = exported;
