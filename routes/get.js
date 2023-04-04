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
module.exports = router;

router.get('/temperature', verifyToken, async (req, res) => {

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