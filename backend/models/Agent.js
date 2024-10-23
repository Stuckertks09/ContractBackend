const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  chatIds: [{ type: String, ref: 'Chat' }],  // List of assigned chat references
  agentId: { type: String },  // Example field for agent expertise
  availability: { type: Boolean, default: true },  // Example availability status
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
