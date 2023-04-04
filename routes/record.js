const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {verifyRover, verifySensor} = require('./../middleware/recordverify')
const { Rover, SensorSet } = require('../models/Devices')
const time = Date.now()
const isWatering = false;
const SOIL_MOISTURE = 0;
// Register rover 
router.post('/rover', verifyRover, async (req, res) => {
    const rover = req.rover;
    if(!rover)
        return res.status(401).json ({ error: 'no brains or what-' });

    // const user = req.user; // Retrieve  the user data from the req object
    rover.records.push(req.body);
    await rover.save();
    console.log('ho gaya')
    res.json({ });
  });
  

// Register sensor 
router.post('/sensor', verifySensor, async (req, res) => {
  
    const sensor = req.sensor;
    if(!sensor)
        return res.status(401).json({ error: 'no brains or what-' });

    // const user = req.user; // Retrieve  the user data from the req object
    try {
      sensor.records.push(req.body);
        if(Number(req.body.soil_moisture) < SOIL_MOISTURE)
        {
          console.log("if block")
          sensor.isWatering = true;
          sensor.timeWateringStart = Date.now();
        }
        else
        {
          console.log("else block")
          if(sensor.isWatering == true)
          {
            sensor.isWatering = false;
            let seconds = Math.abs((new Date()).getTime() - sensor.timeWateringStart.getTime())/1000;
            console.log(seconds)
            sensor.lastWatered = {
              duration: seconds,
              timestamp: sensor.timeWateringStart
            }
          }
        }
        await sensor.save()
        // if(req.body.soil_moisture > SOIL_MOISTURE)
        // {
        //   if(isWatering == true)
        //   return res.json({water: true})
        // }
    }
    
    catch(e)
    {
      console.log(e)
      return res.status(401).json('req.body messed up shit')
    }
    
    console.log('ho gaya');
    return res.json({water: sensor.isWatering});
  });
  
  router.post('/water', verifySensor, async (req, res) => {
    const sensor = req.sensor;
    if(!sensor)
    return res.status(401).json({ error: 'no brains or what-' });
    
    try {
      sensor.lastWatered = {
        duration: Number(req.body.duration)
      }
      await sensor.save();
    }
    catch(e) {
      console.log(e)
      return res.status(401).json({ error: 'couldnt idk why-' });
 
    }
    return res.json({})
  })

module.exports = router;
