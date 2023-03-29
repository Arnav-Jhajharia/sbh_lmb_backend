const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Rover, SensorSet } = require('./Devices')

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rovers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rover' // The name of the referenced model
    } 
    ],
    sensorsets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SensorSet' // The name of the referenced model
      } 
    ]
});


// Hash the user's password before saving it to the database
UserSchema.pre('save', async function(next) {
  const user = this;
  next();
});

// Compare the user's password with the hashed password in the database
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
