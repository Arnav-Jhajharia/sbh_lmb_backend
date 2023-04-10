const mongoose = require('mongoose');

const recordSensorSetSchema = new mongoose.Schema({
  temperature: { type: Number, required: true, default: 0 },
  humidity: { type: Number, required: true, default: 0 },
  sunlight: { type: Number, required: true, default: 0 },
  soil_moisture: { type: Number, required: true, default: 0 },
  batteryLevel: { type: Number, required: true, default: 0 },
  timestamp: { type: Date, required: true, default: Date.now }
});

const TempSensorSetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  records: [recordSensorSetSchema],
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const TempSensorSet = mongoose.model('TempSensorSet', TempSensorSetSchema);

const cron = require('node-cron');

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const from = new Date(now.getTime() - 60000); // Get records from the last minute
  const to = now;

  const records = await SensorSet.aggregate([
    { $match: { timestamp: { $gte: from, $lte: to } } },
    { $unwind: '$records' },
    {
      $group: {
        _id: null,
        temperature: { $avg: '$records.temperature' },
        humidity: { $avg: '$records.humidity' },
        sunlight: { $avg: '$records.sunlight' },
        soil_moisture: { $avg: '$records.soil_moisture' },
        batteryLevel: { $avg: '$records.batteryLevel' },
        timestamp: { $avg: '$records.timestamp' }
      }
    }
  ]);

  const tempSensorSet = new TempSensorSet({
    name: 'temporary',
    records,
    timestamp: now
  });

  await tempSensorSet.save();
});

