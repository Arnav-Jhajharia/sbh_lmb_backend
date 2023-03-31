const jwt = require('jsonwebtoken');
const {Rover, SensorSet} = require('./../models/Devices')
async function verifyRover (req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader;
      req.token = bearerToken;
    const rover = await Rover.findOne({id: bearerHeader})

          if (!rover) {
            res.status(404).json({ error: 'Rover not found' });
          } else {
            req.rover = rover; // Set the user property of the req object to the retrieved user data
            next();
          }

    } else {
      res.sendStatus(403);
    }
  }
  
  async function verifySensor (req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader;
      req.token = bearerToken;
    const sensor = await SensorSet.findOne({id: bearerHeader})

          if (!sensor) {
            res.status(404).json({ error: 'Sensor not found' });
          } else {
            req.sensor = sensor; // Set the user property of the req object to the retrieved user data
            next();
          }

    } else {
      res.sendStatus(403);
    }
  }
  
module.exports = {verifySensor, verifyRover};   