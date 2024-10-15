const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// GET /api/listings - Get listings with pagination and media URLs
router.get('/', async (req, res) => {
    try {
        const { northEastLat, northEastLng, southWestLat, southWestLng } = req.query;

// Construct a bounding box filter for listings
const listings = await Listing.find({
    StandardStatus: 'Active', // Filter for active listings only
    Latitude: { $gte: southWestLat, $lte: northEastLat }, // Bounding box filter for latitude
    Longitude: { $gte: southWestLng, $lte: northEastLng }, // Bounding box filter for longitude
}).select(
    'ListingId ListPrice Latitude Longitude PublicRemarks media.MediaURL BathroomsTotalInteger BedroomsTotal StandardStatus City PostalCode StateOrProvince StreetDirPrefix StreetName StreetNumber StreetSuffix PropertyType ArchitecturalStyle YearBuilt GarageSpaces BuildingAreaTotal TaxAnnualAmount LotSizeAcres'
);

        res.json({ listings });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


// GET /api/listings/:id - Get a single listing by ListingId
router.get('/:id', async (req, res) => {
    try {
        // Include media in the projection for the single listing
        const listing = await Listing.findOne({ ListingId: req.params.id }, 'ListingId ListPrice Latitude Longitude media.MediaURL');
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.json(listing);
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;



