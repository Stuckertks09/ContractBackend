const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  acceptedOfferDate: { type: Date },
  appraisalBuffer: { type: Boolean },
  appraisalBufferAmount: { type: Number }, // Currency (16, 2)
  appraisalContingency: { type: Boolean },
  bindingAcceptance: { type: Date },
  bindingAcceptanceTime: { type: String }, // Time as a String
  closingDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Lookup(User)
  daysBeforeClosingSeptic: { type: Number }, // Number(18, 0)
  daysBeforeClosingWellAndWater: { type: Number }, // Number(18, 0)
  daysForAppraisal: { type: Number },
  daysForEarnestMoney: { type: Number },
  daysForFinancing: { type: Number },
  daysForInspection: { type: Number },
  daysForRadon: { type: Number },
  daysForTesting: { type: Number },
  downpaymentAmount: { type: Number }, // Currency(16, 2)
  downpaymentPercentage: { type: Number }, // Percent
  earnestMoneyAmount: { type: Number }, // Currency(16, 2)
  earnestMoneyHeldBy: { 
    type: String, 
    enum: ['Listing Firm', 'Drafting Firm', 'Other'] 
  }, // Picklist
  escalationBeatOfferBy: { type: Number }, // Currency(16, 2)
  escalationClause: { type: Boolean },
  escalationMaxPurchasePrice: { type: Number }, // Currency(16, 2)
  escalationNoLaterThanDate: { type: Date },
  financedAmount: { type: Number }, // Currency(16, 2)
  financedInterestRate: { type: Number }, // Percent(10, 4)
  financingContingency: { type: Boolean },
  financingTerms: { 
    type: String, 
    enum: ['Conventional', 'ARM', 'Cash', 'FHA', 'VA', 'USDA', 'Other'] 
  }, // Picklist
  homeWarranty: { type: Boolean },
  homeWarrantyAmount: { type: Number }, // Currency(16, 2)
  homeWarrantyPaidBy: { 
    type: String, 
    enum: ['Buyer', 'Seller'] 
  }, // Picklist
  inspectionBuffer: { type: Boolean },
  inspectionBufferAmount: { type: Number }, // Currency(16, 2)
  inspectionContingency: { type: Boolean },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Lookup(User)
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }, // Master-Detail relationship with Listing
  offerName: { type: String, maxlength: 80 }, // Listing Offers Name
  monthlyPayment: { type: Number }, // Currency(16, 2)
  purchasePrice: { type: Number }, // Currency(16, 2)
  radonContingency: { type: Boolean },
  sellerContribution: { type: Boolean },
  sellerContributionAmount: { type: Number }, // Currency(16, 2)
  septicContingency: { type: Boolean },
  septicPaidBy: { 
    type: String, 
    enum: ['Buyer', 'Seller'] 
  }, // Picklist
  stage: { 
    type: String, 
    enum: [
      'Accepted Offer', 
      'Earnest Money', 
      'Inspections', 
      'Appraisal', 
      'Financing', 
      'Awaiting Closing', 
      'Successfully Closed', 
      'Fell Through'
    ] 
  }, // Picklist
  testingContingency: { type: Boolean },
  wellAndWaterContingency: { type: Boolean },
  wellPaidBy: { 
    type: String, 
    enum: ['Buyer', 'Seller'] 
  }, // Picklist
  yearsAmortized: { type: Number } // Number(18, 0)
});

module.exports = mongoose.model('Offer', OfferSchema);
