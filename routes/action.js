const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('./../middleware/verification')
const { Rover, SensorSet } = require('../models/Devices')

router.get('/movement', verifyToken, async (req, res) => {
    try {
    const {direction} = req;
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