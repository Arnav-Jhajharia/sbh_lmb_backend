const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('./../middleware/verification')
const { Rover, SensorSet } = require('../models/Devices')
// Register rover 
router.post('/rover', async (req, res) => {
    const rover = new Rover({
        name: 'kill',
        records: [{
        }]
      });
    
      await rover.save();

    if(!rover)
        return res.status(401).json({ error: 'no brains or what-' });
    
    return res.status(201).json({ id: rover.id });

  });
  

// Register sensor 
router.post('/sensor', async (req, res) => {
    const sensor = new SensorSet({
        name: 'no',
        records: [{
        }],
        lastWatered: {
          
        }
      });

    await sensor.save();

    if(!sensor)
        return res.status(401).json({ error: 'no brains or what-' });
    
    return res.status(201).json({ id: sensor.id });
s
  });
  
  

module.exports = router;
