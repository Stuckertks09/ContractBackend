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
    // Add the location field with geospatial properties
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: {
            type: [Number],
            validate: {
                validator: function (value) {
                    return value.length === 2;
                },
                message: 'Coordinates must be an array of two numbers [longitude, latitude].'
            },
            required: function () {
                // Only require location if Latitude and Longitude are present
                return this.Latitude != null && this.Longitude != null;
            }
        }
    }
});

// Create a geospatial index on the location field for efficient querying
listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model('Listing', listingSchema, 'Listings'); // Specify the collection name if necessary

module.exports = Listing;


