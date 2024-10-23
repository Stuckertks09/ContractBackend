const express = require('express');
const Chat = require('../models/chat');  // Mongoose model for storing chat messages
const User = require('../models/User');  // Mongoose model for user
const Assignment = require('../models/Assignment');  // Mongoose model for chat assignments
const router = express.Router();

// Fetch all messages for a specific chat
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

// Add agent to a chat
router.post('/chat/add-agent', async (req, res) => {
  const { chatId, agentId } = req.body;

  try {
    // Find the chat by chatId
    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the agent is already assigned to the chat
    if (chat.agentIds.includes(agentId)) {
      return res.status(400).json({ message: 'Agent is already assigned to this chat' });
    }

    // Add the new agentId to the array of agents
    chat.agentIds.push(agentId);

    // Save the updated chat
    await chat.save();

    return res.status(200).json({ message: 'Agent added to chat', chat });
  } catch (error) {
    console.error('Add Agent Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch all chats assigned to a specific agent
router.get('/agent/:agentId/chats', async (req, res) => {
    const { agentId } = req.params;

    try {
        // Find all chats where the agent is assigned (agentId is in the agentIds array)
        const assignedChats = await Chat.find({ agentIds: agentId });

        if (assignedChats.length > 0) {
            res.status(200).json(assignedChats);  // Return the assigned chats
        } else {
            res.status(404).json({ message: 'No chats found for this agent' });
        }
    } catch (error) {
        console.error('Error fetching agent chats:', error);
        res.status(500).json({ message: 'Error fetching agent chats', error });
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

