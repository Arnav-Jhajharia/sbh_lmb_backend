const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await user.save();

    // Create and sign JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    // Return response with token
    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
  const { email, password } = req.body; 

  
  
  // Find user by email
  const user = await User.findOne({ email });

  // If user doesn't exist, return an error
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Check if password is correct
  console.log('got memed')
  const passwordMatch = await bcrypt.compare('no', user.password);
  console.log(passwordMatch)
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

  res.json({ token });
  }
  catch(err) {
    return res.status(401).json({ error: err})
  }

});

module.exports = router;
