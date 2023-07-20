if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser');
const app = express()
var cors = require('cors')
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const deviceCreationRouter = require('./routes/deviceCreation')
const deviceRegistrationRouter = require('./routes/deviceRegistration')
const recordRouter = require('./routes/record')
const getRouter = require('./routes/get')
const actionRouter = require('./routes/action')

// app.set('views', __dirname, '/views')

app.use(express.static('public')) 
app.use(cors())

const {SensorSet} = require('./models/Devices')

const cron = require('node-cron');

// Schedule a cron job to run every minute
// cron.schedule('* * * * *', async () => {
//   try {
//     // Get the current timestamp
//     const timestamp = Date.now();

//     // Filter records by sensorSetId
//     const filteredRecords = records.filter(record => record.sensorSetId === 'your-sensor-set-id');

//     // Calculate the average of all the records
//     const averageTemperature = calculateAverage(filteredRecords, 'temperature');
//     const averageHumidity = calculateAverage(filteredRecords, 'humidity');
//     const averageSunlight = calculateAverage(filteredRecords, 'sunlight');
//     const averageSoilMoisture = calculateAverage(filteredRecords, 'soil_moisture');
//     const averageBatteryLevel = calculateAverage(filteredRecords, 'batteryLevel');

//     // Create a new record with the average values and timestamp
//     const newRecord = {
//       temperature: averageTemperature,
//       humidity: averageHumidity,
//       sunlight: averageSunlight,
//       soil_moisture: averageSoilMoisture,
//       batteryLevel: averageBatteryLevel,
//       timestamp: timestamp
//     };

//     // Push the new record into the temp sensor set
//     await TempSensorSetSchema.create(newRecord);

//     // Remove all records that are older than 60 seconds
//     await TempSensorSetSchema.deleteMany({
//       timestamp: { $lt: timestamp - 60000 }
//     });

//     // Get the latest 60 temp records from the temp sensor set
//     const tempRecords = await TempSensorSetSchema.find({
//       sensorSetId: 'your-sensor-set-id'
//     }).sort({ timestamp: -1 }).limit(60);

//     // Create a new record with the average values and timestamp
//     const averageTempRecord = {
//       temperature: calculateAverage(tempRecords, 'temperature'),
//       humidity: calculateAverage(tempRecords, 'humidity'),
//       sunlight: calculateAverage(tempRecords, 'sunlight'),
//       soil_moisture: calculateAverage(tempRecords, 'soil_moisture'),
//       batteryLevel: calculateAverage(tempRecords, 'batteryLevel'),
//       timestamp: timestamp
//     };

//     // Push the new record into the main sensor set
//     await SensorSetSchema.updateOne(
//       { name: 'sensor-set-name' },
//       { $push: { temp_records: averageTempRecord } }
//     );

//   } catch (error) {
//     console.log(error);
//   }
// });

// const cron = require('node-cron');

// Schedule a cron job to run every minute
let job = cron.schedule('* * * * *', async () => {
  try {
    // Get the current timestamp
    const timestamp = Date.now();

    // Find all records that were created in the last 60 seconds
    const sensorSet = await SensorSet.findOne({ id: '964727042' });
    const records = sensorSet.temp_records.filter(temp_records => temp_records.timestamp > timestamp - 60000);
    if(records.length < 4)
    {
      return;
    }
    // Calculate the average of all the records
    const averageTemperature = calculateAverage(records, 'temperature');
    const averageHumidity = calculateAverage(records, 'humidity');
    const averageSunlight = calculateAverage(records, 'sunlight');
    const averageSoilMoisture = calculateAverage(records, 'soil_moisture');
    const averageBatteryLevel = calculateAverage(records, 'batteryLevel');

    // Create a new record with the average values and timestamp
    const newRecord = {
      temperature: averageTemperature,
      humidity: averageHumidity,
      sunlight: averageSunlight,
      soil_moisture: averageSoilMoisture,
      batteryLevel: averageBatteryLevel,
      timestamp: timestamp
    };

    // Insert the new record into the sensor set
    sensorSet.records.push(newRecord);
    if (sensorSet.temp_records.length > 100) {
      await SensorSet.updateOne(
        { id: '964727042' },
        { $set: { temp_records: [] } }
      );
    }


    await sensorSet.save();
  } catch (error) {
    console.log(error);
  }
} ,null,
true,
'America/Los_Angeles');

// Function to calculate the average of a property in an array of records
function calculateAverage(records, property) {
  const sum = records.reduce((total, record) => total + record[property], 0);
  const average = sum / records.length || 0;
  return average;
}

job.start();
// add the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log('Connected to mongoose'))

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/create', deviceCreationRouter)
app.use('/reg', deviceRegistrationRouter)
app.use('/record', recordRouter)
app.use('/get', getRouter)
// app.use('/action', actionRouter)
app.listen(3000, "0.0.0.0")
