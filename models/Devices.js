const mongoose = require('mongoose');

const recordSensorSetSchema = new mongoose.Schema({
    temperature: { type: Number, required: true,default: 0 },
    humidity: { type: Number, required: true,default: 0 },
    sunlight: { type: Number, required: true,default: 0 },
    soil_moisture: { type: Number, required: true,default: 0 },
    batteryLevel: { type: Number, required: true,default: 0 },
    timestamp: { type: Date, required: true, default: Date.now }
  });
const lastWatered = new mongoose.Schema({
  duration: {type: Number, required: true, default: 20},
  timestamp: {type: Date, required: true, default: Date.now},
})
const SensorSetSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    records: [recordSensorSetSchema],
    id: {
      type: String,
      default: () => (Math.floor(Math.random() * 1000000000)).toString(),
      unique: true
    },
    lastWatered: lastWatered, 
    isWatering: {type: Boolean, required: true, default: false},
    timeWateringStart: {type: Date, required: true, default: Date.now},
  });

const SensorSet = mongoose.model('SensorSet', SensorSetSchema);

const recordRoverSchema = new mongoose.Schema({
    status: {type: String, required: true,default: 'Idle' },
    batteryLevel: { type: Number, required: true, default: 0 },
    timestamp: { type: Date, required: true, default: Date.now }
  });
const RoverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    records: [recordRoverSchema],
    id: {
        type: String,
        default: () => Math.floor(Math.random() * 1000000000),
        unique: true
    }
    });

const Rover = mongoose.model('Rover', RoverSchema);

module.exports = { Rover, SensorSet }