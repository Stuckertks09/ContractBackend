const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');  // Adjust the path to the correct location of User model

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token (optional, if using for authentication)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the user details along with the chatId for private room connection
    return res.status(200).json({
      token,
      userId: user._id,
      username: user.username,
      chatId: user.chatId,  // Include chatId for private room connection
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    return res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    // Log the error and send server error response
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
