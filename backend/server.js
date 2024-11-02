const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
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
const chatRoutes = require('./routes/chatRoutes');
const offersRoute = require('./routes/offers');

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);  // Create HTTP server for Express and Socket.IO
const io = socketIo(server);  // Attach Socket.IO to the HTTP server

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Set up CORS
app.use(cors({
    origin: '*',  // Allow all origins or specify your app's IP/domain
    methods: ['GET', 'POST'],
    credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Use API routes
app.use('/api/listings', listingsRoute);
app.use('/api/send-message', twilioRoute);
app.use('/api/search', searchRoute);
app.use('/api/auth', authRoute);
app.use('/api', showingRoutes);
app.use('/api', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/offers', offersRoute);

// Import and use the Socket.IO handler
require('./routes/socket')(io);  // Pass the io instance to the socket handler

// Start the server with WebSockets enabled
const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
