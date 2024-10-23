const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Agent = require('../models/Agent');  // Import the Agent model

// Route to get a list of users
router.get('/users', async (req, res) => {
  try {
    // Find all users and return only necessary fields (e.g., username, email, _id)
    const users = await User.find({}, 'username email _id');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route to get a list of agents
router.get('/agents', async (req, res) => {
  try {
    // Find all agents and return only necessary fields (e.g., firstName, lastName, email, _id)
    const agents = await Agent.find({}, 'FirstName LastName email _id');
    res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Error fetching agents' });
  }
});

module.exports = router;
