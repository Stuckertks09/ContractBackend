const Chat = require('../models/chat'); // Import the Chat model

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Client or agent joins a chat room
        socket.on('joinRoom', (chatId) => {
            socket.join(chatId);  // Join the specific chat room using chatId
            console.log(`Client or agent joined room: ${chatId}`);
        });

        // Handle sending and saving a message
        socket.on('sendMessage', async (data) => {
            const { chatId, senderId, message } = data;

            try {
                // Save message to MongoDB
                const newMessage = new Chat({
                    chatId,
                    senderId,
                    message,
                    timestamp: new Date(),  // Optionally store the timestamp of the message
                });

                await newMessage.save();

                // Emit the message back to the clients and agents in the same room
                io.to(chatId).emit('receiveMessage', {
                    chatId: newMessage.chatId,
                    senderId: newMessage.senderId,
                    message: newMessage.message,
                    timestamp: newMessage.timestamp,
                });

                console.log(`Message sent to room: ${chatId}`);
            } catch (error) {
                console.error('Error saving message to MongoDB:', error);
                socket.emit('errorMessage', { message: 'Failed to send message, please try again later.' });
            }
        });

        // Handle agent or client leaving the room
        socket.on('leaveRoom', (chatId) => {
            socket.leave(chatId);
            console.log(`Client or agent left room: ${chatId}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};
