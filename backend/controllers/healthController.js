const HealthData = require('../models/HealthData');
const { redisClient, isRedisConnected } = require('../config/db');
const { publishToQueue } = require('../config/rabbitmq');

// Elasticsearch is optional - only use if available
let esClient = null;
try {
  const { Client } = require('@elastic/elasticsearch');
  esClient = new Client({ node: 'http://localhost:9200' });
} catch (err) {
  console.warn('Elasticsearch client not available');
}

exports.addHealthData = async (req, res) => {
  const { heartRate, bloodPressureSys, bloodPressureDia, oxygenSaturation, bodyTemperature } = req.body;

  try {
    const healthData = await HealthData.create({
      user: req.user.id,
      heartRate,
      bloodPressureSys,
      bloodPressureDia,
      oxygenSaturation,
      bodyTemperature,
    });

    // Cache in Redis (Latest reading) - only if Redis is connected
    if (isRedisConnected()) {
      try {
        await redisClient.set(`health:${req.user.id}:latest`, JSON.stringify(healthData), { EX: 3600 });
      } catch (redisErr) {
        console.warn('Redis cache error:', redisErr.message);
      }
    }

    // Real-time update via Socket.io
    const io = req.app.get('io');
    io.emit('healthUpdate', healthData);

    // Check for abnormalities and publish to RabbitMQ
    if (heartRate > 100 || bodyTemperature > 38 || oxygenSaturation < 95) {
      try {
        await publishToQueue('alert_queue', {
          type: 'CRITICAL_VITALS',
          data: healthData,
          userId: req.user.id
        });
      } catch (mqErr) {
        console.warn('RabbitMQ publish error:', mqErr.message);
      }
    }

    // Index to Elasticsearch (optional)
    if (esClient) {
      try {
        await esClient.index({
          index: 'health-readings',
          document: {
            userId: req.user.id,
            heartRate,
            bloodPressureSys,
            bloodPressureDia,
            oxygenSaturation,
            bodyTemperature,
            timestamp: new Date(),
          }
        });
      } catch (esError) {
        console.warn('Elasticsearch Index Error:', esError.message);
      }
    }

    res.status(201).json(healthData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHealthHistory = async (req, res) => {
  try {
    const history = await HealthData.find({ user: req.user.id }).sort({ timestamp: -1 }).limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

