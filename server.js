if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const cron = require('./cron');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const deviceCreationRouter = require('./routes/deviceCreation')
const deviceRegistrationRouter = require('./routes/deviceRegistration')
const recordRouter = require('./routes/record')
const getRouter = require('./routes/get')
// app.set('views', __dirname, '/views')

app.use(express.static('public')) 

cron.start();
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
app.listen(3000, "0.0.0.0")
