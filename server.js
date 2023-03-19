if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser');
const app = express()

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')

// app.set('views', __dirname, '/views')

app.use(express.static('public')) 


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
app.use('/api', authRouter)

app.listen(process.env.PORT || 3000)
