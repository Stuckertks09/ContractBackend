const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;