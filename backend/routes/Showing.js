// routes/showing.js
const express = require('express');
const router = express.Router();
const Showing = require('../models/Showing');

// Route to handle POST request to create a new showing
router.post('/showing', async (req, res) => {
  const { dateTime, propertyAddress, instructions } = req.body;

  try {
    // Create a new showing entry
    const newShowing = new Showing({
      dateTime,
      propertyAddress,
      instructions
    });

    // Save the new showing to the database
    await newShowing.save();

    // Return the saved showing as a response
    res.status(201).json(newShowing);
  } catch (error) {
    console.error('Error creating showing:', error);
    res.status(500).json({ message: 'Error creating showing' });
  }
});

// Route to handle GET request to fetch all showings
router.get('/showing', async (req, res) => {
  try {
    // Fetch all showings from the database
    const showings = await Showing.find();
    
    // Return the showings as a response
    res.status(200).json(showings);
  } catch (error) {
    console.error('Error fetching showings:', error);
    res.status(500).json({ message: 'Error fetching showings' });
  }
});


// routes/showing.js
// Additional route for assigning a user to a showing

// Route to assign a user to a showing
router.post('/showing/assign', async (req, res) => {
    const { showingId, userId } = req.body;
  
    try {
      // Find the showing by its ID and update the userId
      const showing = await Showing.findById(showingId);
      if (!showing) {
        return res.status(404).json({ message: 'Showing not found' });
      }
  
      // Assign the user to the showing
      showing.userId = userId;
      await showing.save();
  
      res.status(200).json(showing);
    } catch (error) {
      console.error('Error assigning user:', error);
      res.status(500).json({ message: 'Error assigning user to showing' });
    }
  });

// Endpoint to submit an opinion for a specific showing
router.post('/showing/:showingId/opinion', async (req, res) => {
  const { showingId } = req.params;
  const { userId, rating, notes } = req.body;

  try {
    // Find the showing by ID and push the new opinion to the opinions array
    const updatedShowing = await Showing.findByIdAndUpdate(
      showingId,
      { 
        $push: { opinions: { rating, notes } } 
      },
      { new: true } // Return the updated showing
    );

    if (!updatedShowing) {
      return res.status(404).json({ message: 'Showing not found' });
    }

    res.status(200).json({ message: 'Opinion added successfully', showing: updatedShowing });
  } catch (error) {
    res.status(500).json({ message: 'Error adding opinion', error });
  }
});

// Endpoint to get the opinions (rating and notes) for a specific showing
router.get('/showing/:showingId/opinions', async (req, res) => {
  const { showingId } = req.params;

  try {
    // Find the showing by ID and select the opinions field
    const showing = await Showing.findById(showingId).select('opinions');

    if (!showing) {
      return res.status(404).json({ message: 'Showing not found' });
    }

    res.status(200).json({ message: 'Opinions retrieved successfully', opinions: showing.opinions });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving opinions', error });
  }
});

module.exports = router;

