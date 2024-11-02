const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');

// POST /api/offers - Create a new offer
router.post('/', async (req, res) => {
  try {
    // Create a new offer with the data from the request body
    const offer = new Offer(req.body);

    // Save the offer to the database
    await offer.save();

    // Respond with the created offer
    res.status(201).json(offer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

// GET /api/offers - Retrieve a list of all offers
router.get('/list', async (req, res) => {
  try {
    // Fetch all offers with selective fields
    const offers = await Offer.find({}, 'offerName purchasePrice stage listing _id')
      .populate('listing', 'address') // Populate listing field with only address if needed
      .exec();

    res.status(200).json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Error fetching offers', error });
  }
});

module.exports = router;
