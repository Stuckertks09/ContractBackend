// models/Listing.js

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    ListingId: String,
    ListPrice: Number,
    Latitude: Number,
    Longitude: Number,
    BathroomsTotalInteger: Number,
    BedroomsTotal: Number,
    StandardStatus: String,
    City: String,
    PostalCode: String,
    StateOrProvince: String,
    StreetDirPrefix: String,
    StreetName: String,
    StreetNumber: String,
    StreetSuffix: String,
    TaxAnnualAmount: Number,
    YearBuilt: Number,
    PropertyType: String,
    PublicRemarks: String,
    LotSizeAcres: Number,
    BuildingAreaTotal: Number,
    ArchitecturalStyle: String,
    GarageSpaces: Number,
    media: [
        {
            MediaURL: String,
            PreferredPhotoYN: Boolean,
            // Add other fields if necessary or use Mixed type to allow any fields:
            // type: mongoose.Schema.Types.Mixed
        },
    ],
});

const Listing = mongoose.model('Listing', listingSchema, 'Listings'); // Specify the collection name if necessary

module.exports = Listing;

