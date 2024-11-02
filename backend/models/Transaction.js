const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  acceptedOfferDate: { type: Date },
  additionalProvisions: { type: String }, // Long Text Area
  agencyType: { 
    type: String, 
    enum: ['Agent of Buyer', 'Agent of Seller', 'Dual Agency'] 
  }, // Picklist
  appraisalContingency: { type: Boolean },
  appraisalDueDate: { type: Date },
  appraisalGap: { type: Boolean },
  appraisalGapAmount: { type: Number }, // Currency (16, 2)
  buyerInspectionLanguage: { type: String }, // Formula (Text)
  buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references
  closingDate: { type: Date },
  commission: { type: Number }, // Currency (16, 2)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Lookup(User)
  earnestMoneyAmount: { type: Number }, // Currency (16, 2)
  earnestMoneyDueDate: { type: Date },
  earnestMoneyHeldBy: { 
    type: String, 
    enum: ['Listing Firm', 'Drafting Firm', 'Other'] 
  }, // Picklist
  earnestMoneyMemo: { type: String }, // Formula (Text)
  escalationBeatOfferBy: { type: Number }, // Currency (16, 2)
  escalationClause: { type: Boolean },
  escalationMaxPurchasePrice: { type: Number }, // Currency (16, 2)
  escalationNoLaterThanDate: { type: Date },
  financingContingency: { type: Boolean },
  financingDueDate: { type: Date },
  homeWarranty: { type: Boolean },
  homeWarrantyAmount: { type: Number }, // Currency (16, 2)
  homeWarrantyPaidBy: { type: String, enum: ['Buyer', 'Seller'] }, // Picklist
  inspectionBuffer: { type: Boolean },
  inspectionBufferAmount: { type: Number }, // Currency (16, 2)
  inspectionContingency: { type: Boolean },
  inspectionDueDate: { type: Date },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Lookup(User)
  listingAddress: { type: String, maxlength: 100 },
  listingOffice: { type: String, maxlength: 50 },
  listingOfficeLicenseNumber: { type: String, maxlength: 20 },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }, // Lookup(Offer)
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Lookup(User, Group)
  propertyAddress: { type: String }, // Address type
  purchasePrice: { type: Number }, // Currency (16, 2)
  radonContingency: { type: Boolean },
  radonDueDate: { type: Date },
  recordType: { type: String }, // Record Type
  sellerContribution: { type: Boolean },
  sellerContributionAmount: { type: Number }, // Currency (16, 2)
  sellerTitleOffice: { type: String, maxlength: 50 },
  sellers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references
  septicContingency: { type: Boolean },
  septicDueDate: { type: Date },
  septicPaidBy: { type: String, enum: ['Buyer', 'Seller'] }, // Picklist
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
  testingDueDate: { type: Date },
  transactionName: { type: String, maxlength: 80 },
  wellAndWaterContingency: { type: Boolean },
  wellAndWaterDueDate: { type: Date },
  wellPaidBy: { type: String, enum: ['Buyer', 'Seller'] } // Picklist
});

module.exports = mongoose.model('Transaction', TransactionSchema);
