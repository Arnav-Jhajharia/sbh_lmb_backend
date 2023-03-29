const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('./../middleware/verification')
const { Rover, SensorSet } = require('../models/Devices')

// Register rover 
router.post('/rover', verifyToken, async (req, res) => {
    const { id } = req.body;
    const rover = await Rover.findOne({ id });
    if(!rover)
        return res.status(401).json ({ error: 'no brains or what-' });

    const user = req.user; // Retrieve  the user data from the req object
    user.rovers.push(rover);
    await user.save();
    console.log('ho gaya')
    res.json({ });
  });
  

// Register sensor 
router.get('/sensor', verifyToken, async (req, res) => {
    const { id } = req.body;
    const sensor = await SensorSet.findOne({ id });
    if(!rover)
        return res.status(401).json({ error: 'no brains or what-' });

    const user = req.user; // Retrieve  the user data from the req object
    user.sensorsets.push(rover);
    await user.save();
    console.log('ho gaya')
    res.json({ });
  });
  

module.exports = router;
