const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', default: null }, // null if not tied to a specific transaction
});

module.exports = mongoose.model('Task', TaskSchema);