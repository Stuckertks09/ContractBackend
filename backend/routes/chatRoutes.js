// File: chatRoutes.js

const express = require('express');
const Chat = require('../models/chat');  // Mongoose model for storing chat messages
const Assignment = require('../models/Assignment');  // Mongoose model for chat assignments
const router = express.Router();

router.get('/conversations/:chatId', async (req, res) => {
    const { chatId } = req.params;

    try {
        // Fetch all messages for the given chatId
        const messages = await Chat.find({ chatId });

        if (messages.length > 0) {
            res.status(200).json({ messages });  // Return as an array
        } else {
            res.status(404).json({ message: 'No messages found for this chat' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

// Fetch all unique chats with the latest message
router.get('/chats', async (req, res) => {
    try {
        // Aggregate to find the latest message for each unique chatId
        const chats = await Chat.aggregate([
            { $sort: { timestamp: -1 } },  // Sort by timestamp, latest first
            {
                $group: {
                    _id: "$chatId",  // Group by chatId
                    lastMessage: { $first: "$message" },  // Get the most recent message
                    name: { $first: "$senderName" },  // Use senderName as chat name for simplicity
                    chatId: { $first: "$chatId" }  // Include the chatId in the response
                }
            }
        ]);

        if (chats.length > 0) {
            res.status(200).json(chats);  // Return the list of chats
        } else {
            res.status(404).json({ message: 'No chats found' });
        }
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Error fetching chats', error });
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
