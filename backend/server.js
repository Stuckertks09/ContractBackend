const express = require('express');
const http = require('http');  // Required for integrating Socket.IO with Express
const socketIo = require('socket.io');  // For WebSockets (Socket.IO)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const twilio = require('twilio');
const listingsRoute = require('./routes/listings');
const twilioRoute = require('./routes/twilio');
const searchRoute = require('./routes/search');
const authRoute = require('./routes/auth');
const showingRoutes = require('./routes/Showing');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chatRoutes')


dotenv.config(); // Load environment variables

const app = express();

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = socketIo(server);  // Socket.IO instance on the server

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Set up CORS
app.use(cors({
    origin: '*',  // Or specify your app's IP or domain
    methods: ['GET', 'POST'],
    credentials: true
  }));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Use listings API route
app.use('/api/listings', listingsRoute);
app.use('/api/send-message', twilioRoute);
app.use('/api/search', searchRoute);
app.use('/api/auth', authRoute);
app.use('/api', showingRoutes);
app.use('/api', userRoutes);
app.use('/api/chat', chatRoutes); 

// Import and use the Socket.IO handler
require('./routes/socket')(io);  // Pass the io instance to the socket handler

// Start the server with WebSockets enabled
const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
