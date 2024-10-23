// File: models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: false },
    message: { type: String, required: true },
    agentIds: [{ type: String }],
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Chat', chatSchema);
