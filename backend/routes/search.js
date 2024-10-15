const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// GET /api/search - Search listings based on a query string
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;

    // MongoDB Atlas Search query to filter listings
    const listings = await Listing.aggregate([
      {
        $search: {
          index: 'Address2',  // Use the established Address2 search index
          compound: {
            should: [
              // Text search for city
              {
                text: {
                  query: query,  // User input
                  path: "City",  // Field to search for city names
                  score: { boost: { value: 2 } }  // Boost city matches higher
                }
              },
              // Text search for street number, street name, and street suffix (address)
              {
                text: {
                  query: query,  // User input
                  path: ["StreetNumber", "StreetName", "StreetSuffix", "StreetDirPrefix"],  // Address-related fields
                  score: { boost: { value: 3 } }  // Lower boost for address fields
                }
              }
            ]
          }
        }
      },
      {
        $match: {
          StandardStatus: 'Active'  // Only show active listings
        }
      },
      {
        $limit: 20  // Limit the results
      },
      {
        $project: {
          ListingId: 1,
          ListPrice: 1,
          Latitude: 1,
          Longitude: 1,
          City: 1,
          StreetNumber: 1,
          StreetName: 1,
          StreetSuffix: 1,
          PostalCode: 1,
          StateOrProvince: 1,
          BedroomsTotal: 1,
          BathroomsTotalInteger: 1,
          media: { MediaURL: 1 }  // Project the media URLs
        }
      }
    ]);
    

    res.json({ listings });
  } catch (error) {
    console.error('Error searching listings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
