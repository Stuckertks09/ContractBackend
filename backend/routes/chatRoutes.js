// File: chatRoutes.js

const express = require('express');
const Chat = require('../models/chat');  // Mongoose model for storing chat messages
const Assignment = require('../models/Assignment');  // Mongoose model for chat assignments
const router = express.Router();

// Route to fetch messages of a particular chat
router.get('/conversations/:chatId', async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await Chat.find({ chatId });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

// Reassign chat to a new agent or group
router.post('/chat/reassign', async (req, res) => {
    const { userId, newAgentRoom } = req.body;  // newAgentRoom represents the new chat room for the agent or group
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the chat room the user is assigned to
      user.chatId = newAgentRoom;
      await user.save();
  
      return res.status(200).json({ message: 'User reassigned to new chat', chatId: newAgentRoom });
    } catch (error) {
      console.error('Reassignment Error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

module.exports = router;
