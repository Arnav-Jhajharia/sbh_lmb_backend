const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {verifyRover, verifySensor} = require('./../middleware/recordverify')
const verifyToken = require('./../middleware/verification')
const { Rover, SensorSet } = require('../models/Devices');
const { removeListener } = require('../models/User');
const time = Date.now()
const isWatering = false;
const SOIL_MOISTURE = 50;
// Register rover 
router.post('/rover', verifyToken, async (req, res) => {
  // const user = req.user; // Retrieve  the user data from the req object
  try {
    const roverId = req.user.rovers;

    const { direction } = req.body;
    if(roverId == null) return;
    let rover = await Rover.findOne({_id:roverId})
    
    if(!rover)
        return res.status(401).json({ error: 'no brains or what-' });
    rover.records.push({movement:direction});
    const limit = 10; // number of records to keep
    

    if (rover.records.length > limit) {
      rover.records.splice(0, rover.records.length - limit);
   
    }
    
    await rover.save()
      // if(req.body.soil_moisture > SOIL_MOISTURE)
      // {
      //   if(isWatering == true)
      //   return res.json({water: true})
      // }
 
      console.log('ho gaya');
      return res.json({rover: rover.toJSON()});
  }
  
  catch(e)
  {
    console.log(e)
    return res.status(401).json('req.body messed up shit')
  }
 
});

router.post('/moisture', verifyToken, async (req, res)=> {

// const user = req.user; // Retrieve  the user data from the req object
 try {
  const sensorId = req.user.sensorsets;
  const { moistureLevel } = req.body;
  if(sensorId == null) return res.status(401);
  let sensor = await SensorSet.findOne({_id:sensorId})
  
  if(!sensor)
      return res.status(401).json({ error: 'no brains or what-' });
  sensor.thresholdMoisture = moistureLevel;
  const limit = 10; // number of records to keep
  
await sensor.save()
    // if(req.body.soil_moisture > SOIL_MOISTURE)
    // {
    //   if(isWatering == true)
    //   return res.json({water: true})
    // }

    console.log('ho gaya');
    return res.json({sensor: sensor.toJSON()});
}

catch(e)
{
  console.log(e)
  return res.status(401).json('req.body messed up shit')
}

});

// Register sensor 
router.post('/sensor', verifySensor, async (req, res) => {
  
    const sensor = req.sensor;
    if(!sensor)
        return res.status(401).json({ error: 'no brains or what-' });

    // const user = req.user; // Retrieve  the user data from the req object
    try {
      sensor.temp_records.push(req.body);
      if(sensor.waterMode != 'auto') {
        if(sensor.waterMode == 'on')

        await sensor.save();

        return res.json({water: (sensor.waterMode === 'on')?true:false});
      }
        if(Number(req.body.soil_moisture) < sensor.thresholdMoisture)
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

router.get('/getDirection', verifyRover, async (req, res) => {
  const rover = req.rover;
  if(!rover)
  return res.status(401).json({ error: 'no brains or what-' });
  if(rover.records[rover.records.length - 1].seed == true)
  {
    rover.records.push({seed:false, arm:'down'})
    await rover.save();
    return res.json(rover.records[rover.records.length - 2])
  }
  return res.json(rover.records[rover.records.length - 1])
})


module.exports = router;


router.post('/arm', verifyToken, async (req, res) => {
 // const user = req.user; // Retrieve  the user data from the req object
 try {
  const roverId = req.user.rovers;

  const { arm, seed } = req.body;
  if(roverId == null) return;
  let rover = await Rover.findOne({_id:roverId})
  
  if(!rover)
      return res.status(401).json({ error: 'no brains or what-' });
  rover.records.push({arm:arm, seed:seed});
  const limit = 10; // number of records to keep
  

  if (rover.records.length > limit) {
    rover.records.splice(0, rover.records.length - limit);
 
  }
  
  await rover.save()
    // if(req.body.soil_moisture > SOIL_MOISTURE)
    // {
    //   if(isWatering == true)
    //   return res.json({water: true})
    // }

    console.log('ho gaya');
    return res.json({rover: rover.toJSON()});
}

catch(e)
{
  console.log(e)
  return res.status(401).json('req.body messed up shit')
}

});


router.post('/self_water', verifyToken, async (req, res)=> {

  // const user = req.user; // Retrieve  the user data from the req object
   try {
    const sensorId = req.user.sensorsets;
    const { waterMode } = req.body;
    if(sensorId == null) return res.status(401);
    if(!sensor)
        return res.status(401).json({ error: 'no brains or what-' });
    let sensor = await SensorSet.findOne({_id:sensorId})

    if(waterMode != 'auto')
    {
      if(waterMode == 'on' && sensor.waterMode == 'off')
      {
        sensor.timeWateringStart = Date.now();
      }
      else if(waterMode == 'off' && sensor.waterMode == 'on')
      {
        let seconds = Math.abs((new Date()).getTime() - sensor.timeWateringStart.getTime())/1000;
        console.log(seconds)
        sensor.lastWatered = {
          duration: seconds,
          timestamp: sensor.timeWateringStart
        }
      }
    }
    if(waterMode != 'manual')
    sensor.waterMode = waterMode;
    else 
    sensor.waterMode = 'off';
    
    // sensor.thresholdMoisture = moistureLevel;
    
    
    await sensor.save()
      // if(req.body.soil_moisture > SOIL_MOISTURE)
      // {
      //   if(isWatering == true)
      //   return res.json({water: true})
      // }
  
      console.log('ho gaya');
      return res.json({rover: sensor.toJSON()});
  }
  
  catch(e)
  {
    console.log(e)
    return res.status(401).json('req.body messed up shit')
  }
  
  });