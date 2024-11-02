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

// GET /:offerId - Retrieve a specific offer by ID
router.get('/:offerId', async (req, res) => {
  const { offerId } = req.params;

  try {
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ message: 'Error fetching offer', error });
  }
});

// PUT /:offerId - Update a specific offer by ID
router.put('/:offerId', async (req, res) => {
  const { offerId } = req.params;
  const updateData = req.body; // The data to update

  try {
    const updatedOffer = await Offer.findByIdAndUpdate(offerId, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures validation rules are applied
    });

    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(updatedOffer);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ message: 'Error updating offer', error });
  }
});

// DELETE /:offerId - Delete a specific offer by ID
router.delete('/:offerId', async (req, res) => {
  const { offerId } = req.params;

  try {
    const deletedOffer = await Offer.findByIdAndDelete(offerId);

    if (!deletedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ message: 'Error deleting offer', error });
  }
});

module.exports = router;
