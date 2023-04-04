const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('./../middleware/verification')
const { Rover, SensorSet } = require('../models/Devices')

// Register rover 
router.get('/rover', verifyToken, async (req, res) => {
    const roverId = req.user.rovers;
    const rover = await Rover.findOne({_id:roverId})
    console.log(rover)
    if(!rover)
        return res.status(401).json ({ error: 'no brains or what-' });


    return res.json(rover.toJSON());
  });
  

// Register sensor 
router.get('/sensor', verifyToken, async (req, res) => {
  try {
    const sensorId = req.user.sensorsets;
    
    console.log(sensorId);
    const sensor = await SensorSet.findOne({_id:sensorId})
    console.log(sensor)
    if(!sensor)
        return res.status(401).json({ error: 'no brains or what-' });
    const records = sensor.records[sensor.records.length - 1]
    return res.json({records: records, lastWatered: sensor.lastWatered});
  }

  catch(e) {
    console.log(e)
    return res.status(400);
  }
  });
  
router.get('/userInfo', verifyToken, async (req, res) => {
    return res.json(req.user.toJSON())
})


router.get('/devices', verifyToken, async (req, res) => {
  try {
  const roverId = req.user.rovers;
  const sensorId = req.user.sensorsets;
  let rover, sensor;
  rover = sensor = null;
  if(roverId != null)
    rover = await Rover.findOne({_id:roverId})
  if(sensorId != null)
    sensor = await SensorSet.findOne({_id:sensorId})
  
  let json = {}
  if(rover)
  {
    json = {...json, rover}
  }
  if(sensor)
  {
    json = {...json, sensor}
  }

  return res.json(json);
}
catch(e) 
{
  return res.status(400).json({error:e})
}
}) 
router.get('/charts', async (req, res) => {
  const { startDate, endDate } = req.query;

  // Set the default start date to 24 hours ago
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 2500);
  const end = endDate ? new Date(endDate) : new Date();

  // Retrieve data from MongoDB with a 2-minute interval
  const data = await SensorSet.aggregate([
    {
      $match: {
        'records.timestamp': { $gte: start, $lte: end },
      },
    },
    {
      $project: {
        _id: 0,
        temperature: '$records.temperature',
        humidity: '$records.humidity',
        sunlight: '$records.sunlight',
        soil_moisture: '$records.soil_moisture',
        timestamp: {
          $dateTrunc: {
            date: '$records.timestamp',
            unit: 'minute',
          },
        },
      },
    },
    {
      $group: {
        _id: '$timestamp',
        temperature: { $avg: '$temperature' },
        humidity: { $avg: '$humidity' },
        sunlight: { $avg: '$sunlight' },
        soil_moisture: { $avg: '$soil_moisture' },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $group: {
        _id: null,
        temperature: { $push: '$temperature' },
        humidity: { $push: '$humidity' },
        sunlight: { $push: '$sunlight' },
        soil_moisture: { $push: '$soil_moisture' },
        timestamp: { $push: { $dateToString: { format: '%I:%M %p', date: '$_id' } } },
      },
    },
    {
      $project: {
        _id: 0,
        temperature: { $slice: ['$temperature', 50] },
        humidity: { $slice: ['$humidity', 50] },
        sunlight: { $slice: ['$sunlight', 50] },
        soil_moisture: { $slice: ['$soil_moisture', 50] },
        timestamp: { $slice: ['$timestamp', 50] },
      },
    },
  ]);

  res.json(data[0]);
});


module.exports = router;