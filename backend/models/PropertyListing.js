const mongoose = require('mongoose');

const PropertyListingSchema = new mongoose.Schema({
  sellers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references for multiple sellers
  excludedBuyers: { type: String, maxlength: 32768 }, // Long Text Area
  exclusions: { type: String, maxlength: 32768 }, // Long Text Area
  expirationDate: { type: Date },
  firmCommissionRate: { type: Number }, // Percent (4, 2)
  firmMarketingPlan: { type: String, maxlength: 32768 }, // Long Text Area
  inclusions: { type: String, maxlength: 32768 }, // Long Text Area
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Lookup(User)
  listPrice: { type: Number }, // Currency (16, 2)
  listingDate: { type: Date },
  listingName: { type: String, maxlength: 80 }, // Text(80)
  propertyAddress: { type: String }, // Address type
  restrictAccessToProperty: { type: String, maxlength: 32768 }, // Long Text Area
  stage: { 
    type: String, 
    enum: [
      'Pre-Listing', 
      'Active', 
      'Contingency', 
      'Closed - Won', 
      'Closed - Fell Through'
    ] 
  }, // Picklist for property listing stages
  subAgentCommission: { type: Number } // Percent (4, 2)
});

module.exports = mongoose.model('PropertyListing', PropertyListingSchema);
