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

module.exports = router;
