// models/Showing.js
const mongoose = require('mongoose');

// Define the schema for a showing
const showingSchema = new mongoose.Schema({
  dateTime: {
    type: String,
    required: true
  },
  propertyAddress: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
  },
  userId: {
    type: String, // This will hold the ID of the user assigned to the showing
    default: null // Initially null, as the agent assigns the user later
  },
  agentMLSId {
    type: String,
});

// Create the model from the schema
const Showing = mongoose.model('Showing', showingSchema);

module.exports = Showing;
