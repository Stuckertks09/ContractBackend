const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Agent = require('../models/Agent');
const { v4: uuidv4 } = require('uuid');

// User signup
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

    // Generate a unique chatId for each user
    const chatId = uuidv4();

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      chatId,  // Store the unique chatId for each user
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response with the unique chatId
    return res.status(201).json({ message: 'User created successfully', chatId });

  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User login
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
      chatId: user.chatId,
      FirstName: user.firstName,
      LastName: user.lastName,
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Agent login
router.post('/agent/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the agent exists
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(400).json({ message: 'Agent not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ agentId: agent._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the agent details
    return res.status(200).json({
      token,
      agentId: agent._id,
      FirstName: agent.firstName,
      LastName: agent.lastName,
      email: agent.email,
    });

  } catch (error) {
    console.error('Agent Login Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin route to create a new agent (admin-only)
router.post('/agent/create', async (req, res) => {
  const { FirstName, LastName, email, password } = req.body;

  try {
    // Check if the agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new agent
    const newAgent = new Agent({
      FirstName,
      LastName,
      email,
      password: hashedPassword,
    });

    // Save the new agent to the database
    await newAgent.save();

    // Send success response
    return res.status(201).json({ message: 'Agent created successfully' });

  } catch (error) {
    console.error('Agent Creation Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

