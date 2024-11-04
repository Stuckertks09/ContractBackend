const mongoose = require('mongoose');
const { sendOfferEmail } = require('../util/nodemailertest'); // Adjusted path to emailService.js
const OfferSummaryEmailTemplate = require('../util/OfferSummaryEmailTemplate'); // Adjusted path to OfferSummaryEmailTemplate.js
const Transaction = require('./Transaction');

const OfferSchema = new mongoose.Schema({
  acceptedOfferDate: { type: Date },
  appraisalBuffer: { type: Boolean },
  appraisalBufferAmount: { type: Number },
  appraisalContingency: { type: Boolean },
  additionalProvisions: { type: String },
  bindingAcceptance: { type: Date },
  buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  closingDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  daysBeforeClosingSeptic: { type: Number },
  daysBeforeClosingWellAndWater: { type: Number },
  daysForAppraisal: { type: Number },
  daysForEarnestMoney: { type: Number },
  daysForFinancing: { type: Number },
  daysForInspection: { type: Number },
  daysForRadon: { type: Number },
  daysForTesting: { type: Number },
  downpaymentAmount: { type: Number },
  downpaymentPercentage: { type: Number },
  earnestMoneyAmount: { type: Number },
  earnestMoneyHeldBy: { type: String, enum: ['Listing Firm', 'Drafting Firm', 'Other'] },
  escalationBeatOfferBy: { type: Number },
  escalationClause: { type: Boolean },
  escalationMaxPurchasePrice: { type: Number },
  escalationNoLaterThanDate: { type: Date },
  financedAmount: { type: Number },
  financedInterestRate: { type: Number },
  financingContingency: { type: Boolean },
  financingTerms: { type: String, enum: ['Conventional', 'ARM', 'Cash', 'FHA', 'VA', 'USDA', 'Other'] },
  homeWarranty: { type: Boolean },
  homeWarrantyAmount: { type: Number },
  homeWarrantyPaidBy: { type: String, enum: ['Buyer', 'Seller'] },
  inspectionBuffer: { type: Boolean },
  inspectionBufferAmount: { type: Number },
  inspectionContingency: { type: Boolean },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  offerName: { type: String, maxlength: 80 },
  monthlyPayment: { type: Number },
  purchasePrice: { type: Number },
  radonContingency: { type: Boolean },
  sellerContribution: { type: Boolean },
  sellerContributionAmount: { type: Number },
  septicContingency: { type: Boolean },
  septicPaidBy: { type: String, enum: ['Buyer', 'Seller'] },
  stage: { type: String, enum: ['Accepted Offer', 'Signatures', 'Inspections', 'Appraisal', 'Financing', 'Awaiting Closing', 'Successfully Closed', 'Fell Through'] },
  testingContingency: { type: Boolean },
  wellAndWaterContingency: { type: Boolean },
  wellPaidBy: { type: String, enum: ['Buyer', 'Seller'] },
  yearsAmortized: { type: Number }
});

// Helper function to calculate due dates
const calculateDueDate = (baseDate, days) => {
  if (!baseDate || isNaN(new Date(baseDate).getTime()) || days === undefined || days === null) {
    return null; // Return null if baseDate or days is invalid
  }
  const resultDate = new Date(baseDate);
  resultDate.setDate(resultDate.getDate() + days);
  return resultDate;
};

// Trigger to handle status change and create a transaction
OfferSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return; // Exit if no document was found

  // Check if the stage was changed to "Accepted Offer"
  if (doc.stage === 'Accepted Offer') {
    console.log('Creating transaction for accepted offer:', doc._id);

    // Prepare transaction data
    const transactionData = {
      acceptedOfferDate: doc.acceptedOfferDate,
      additionalProvisions: doc.additionalProvisions,
      appraisalContingency: doc.appraisalContingency,
      appraisalDueDate: doc.appraisalContingency ? calculateDueDate(doc.acceptedOfferDate, doc.daysForAppraisal) : null,
      buyers: doc.buyers,
      closingDate: doc.closingDate,
      earnestMoneyAmount: doc.earnestMoneyAmount,
      earnestMoneyDueDate: calculateDueDate(doc.acceptedOfferDate, doc.daysForEarnestMoney),
      earnestMoneyHeldBy: doc.earnestMoneyHeldBy,
      escalationBeatOfferBy: doc.escalationBeatOfferBy,
      escalationClause: doc.escalationClause,
      escalationMaxPurchasePrice: doc.escalationMaxPurchasePrice,
      escalationNoLaterThanDate: doc.escalationNoLaterThanDate,
      financingContingency: doc.financingContingency,
      financingDueDate: doc.financingContingency ? calculateDueDate(doc.acceptedOfferDate, doc.daysForFinancing) : null,
      homeWarranty: doc.homeWarranty,
      homeWarrantyAmount: doc.homeWarrantyAmount,
      homeWarrantyPaidBy: doc.homeWarrantyPaidBy,
      inspectionBuffer: doc.inspectionBuffer,
      inspectionBufferAmount: doc.inspectionBufferAmount,
      inspectionContingency: doc.inspectionContingency,
      inspectionDueDate: doc.inspectionContingency ? calculateDueDate(doc.acceptedOfferDate, doc.daysForInspection) : null,
      radonContingency: doc.radonContingency,
      radonDueDate: doc.radonContingency ? calculateDueDate(doc.acceptedOfferDate, doc.daysForRadon) : null,
      septicContingency: doc.septicContingency,
      septicDueDate: doc.septicContingency ? calculateDueDate(doc.closingDate, doc.daysBeforeClosingSeptic * -1) : null,
      testingContingency: doc.testingContingency,
      testingDueDate: doc.testingContingency ? calculateDueDate(doc.acceptedOfferDate, doc.daysForTesting) : null,
      wellAndWaterContingency: doc.wellAndWaterContingency,
      wellAndWaterDueDate: doc.wellAndWaterContingency ? calculateDueDate(doc.closingDate, doc.daysBeforeClosingWellAndWater * -1) : null,
      purchasePrice: doc.purchasePrice,
      transactionName: `${doc.offerName} Transaction`,
      stage: 'Accepted Offer',
      offer: doc._id
    };

    try {
      // Create a new Transaction document
      const newTransaction = new Transaction(transactionData);
      await newTransaction.save();
      console.log('Transaction created successfully:', newTransaction._id);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  } else {
    console.log(`Transaction creation skipped for offer ${doc._id} because stage is not "Accepted Offer".`);
  }
});

OfferSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return; // If no document was found, exit early

  // Fetch the full document by ID to ensure all fields are included
  const fullDoc = await this.model.findById(doc._id).populate('buyers');

  console.log('Full document after findOneAndUpdate:', fullDoc);
  const isStageChangedToSignatures = (this.previousStage !== 'Signatures' && fullDoc.stage === 'Signatures');

  if (isStageChangedToSignatures) {
    console.log('Stage is "Signatures" for offer, sending offer email:', fullDoc._id);

    for (const buyer of fullDoc.buyers) {
      if (buyer && buyer.email) {
        const emailContent = OfferSummaryEmailTemplate(fullDoc, buyer); // Use `fullDoc` to ensure all fields are present
        await sendOfferEmail(buyer, fullDoc, emailContent); // Pass the complete document
        console.log(`Offer email sent to ${buyer.email}`);
      } else {
        console.error(`Buyer email not found for buyer ID: ${buyer._id}`);
      }
    }
  } else {
    console.log(`Offer ${fullDoc._id} updated without stage change to "Signatures". Email not sent.`);
  }
});


const Offer = mongoose.model('Offer', OfferSchema);
module.exports = Offer;
