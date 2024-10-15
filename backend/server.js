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

dotenv.config(); // Load environment variables

const app = express();

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = socketIo(server);  // Socket.IO instance on the server

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Set up CORS
app.use(cors());

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

// WebSocket connection handler
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for incoming messages from users/agents
    socket.on('sendMessage', (message) => {
        const { text, sender, recipient, forwardToPhone, recipientPhoneNumber } = message;

        // Broadcast the message to all connected clients (real-time message delivery)
        io.emit('receiveMessage', message);

        // Check if SMS forwarding is enabled for the recipient
        if (forwardToPhone && recipientPhoneNumber) {
            // Send the message to the recipient's phone via Twilio
            client.messages
                .create({
                    body: `New message from ${sender}: ${text}`,
                    from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio number
                    to: recipientPhoneNumber  // Recipient's phone number
                })
                .then((msg) => console.log(`Message sent to phone, SID: ${msg.sid}`))
                .catch((error) => console.error('Error sending SMS via Twilio:', error));
        }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server with WebSockets enabled
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
