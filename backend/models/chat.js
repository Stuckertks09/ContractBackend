// File: models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);