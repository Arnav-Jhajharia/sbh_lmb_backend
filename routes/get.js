const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('./../middleware/verification')
const { Rover, SensorSet } = require('../models/Devices')

// Register rover 
router.get('/rover', verifyToken, async (req, res) => {
    const roverId = req.user.rovers[0];
    const rover = await Rover.findOne({_id:roverId})
    console.log(rover)
    if(!rover)
        return res.status(401).json ({ error: 'no brains or what-' });


    return res.json(rover.toJSON());
  });
  

// Register sensor 
router.get('/sensor', verifyToken, async (req, res) => {
    const sensorId = req.user.sensorsets[0];
    console.log(sensorId);
    const sensor = await SensorSet.findOne({_id:sensorId})
    console.log(sensor)
    if(!sensor)
        return res.status(401).json({ error: 'no brains or what-' });

    return res.json(sensor.toJSON());
  });
  
router.get('/userInfo', verifyToken, async (req, res) => {
    return res.json(req.user.toJSON())
})
module.exports = router;
