const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  chatId: { type: String, required: true },
  FirstName: { type: String, required: false },
  LastName: { type: String, required: false }
});

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
