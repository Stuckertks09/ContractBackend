// File: models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
