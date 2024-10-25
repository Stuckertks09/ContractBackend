const mongoose = require('mongoose');

// Define the schema for an opinion (without userId)
const opinionSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Define the schema for a showing, with embedded opinions
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
   MLSNumber: {
    type: String,
  },
  userId: {
    type: String, 
    default: null 
  },
  agentMLSId: {
    type: String,
    default: null
  },
  opinions: [opinionSchema]  // Embedding opinions without userId
});

// Create the model from the schema
const Showing = mongoose.model('Showing', showingSchema);

module.exports = Showing;
