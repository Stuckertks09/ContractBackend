// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to get a list of users
router.get('/users', async (req, res) => {
  try {
    // Find all users and return only necessary fields (e.g., username, _id)
    const users = await User.find({}, 'username email _id');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route to get a list of users
router.get('/agents', async (req, res) => {
  try {
    // Find all users and return only necessary fields (e.g., username, _id)
    const users = await User.find({}, 'username email _id');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
