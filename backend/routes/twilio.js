// routes/twilio.js

const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// POST /api/send-message - Route to send a message via Twilio
router.post('/', async (req, res) => {
  const { body, to } = req.body;

  // Ensure required fields are present
  if (!body || !to) {
    return res.status(400).send('Missing required fields: body, to');
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Send message via Twilio
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,  // Twilio phone number
      to,  // Recipient's number
    });

    res.status(200).json({ message: 'Message sent successfully', sid: message.sid });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Failed to send message');
  }
});

module.exports = router;
