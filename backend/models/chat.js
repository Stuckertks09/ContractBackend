// File: models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: false },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
