const express = require('express');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const numberToWords = require('number-to-words');
const mongoose = require('mongoose');
const Offer = mongoose.model('Offer');
const splitTextByCharacterLimits = require('../util/textSplitter');
const fieldConfig = require('../config/fieldConfig');

const router = express.Router();
const templatePath = path.join(__dirname, '123.pdf');

router.post('/create-template', async (req, res) => {
    const offerId = req.query.offerId || req.body.offerId; // Accept offerId from query or body
  
    try {
      const offer = await Offer.findById(offerId).populate('buyers', 'FirstName LastName');
      if (!offer) {
        return res.status(404).send('Offer not found');
      }

    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const form = pdfDoc.getForm();

    const defaultFontSize = 10;
    form.getFields().forEach((field) => {
      if (field.constructor.name === 'PDFTextField') {
        field.setFontSize(defaultFontSize);
        field.setText('');
      }
    });

    // Buyers
    const buyersText = offer.buyers.map(buyer => `${buyer.firstName} ${buyer.lastName}`).join('; ');
    form.getTextField('Buyers').setText(buyersText);

    // Street Address
    const streetAddressText = splitTextByCharacterLimits(offer.streetAddress, fieldConfig.streetAddress);
    fieldConfig.streetAddress.forEach((field, index) => {
      const textField = form.getTextField(field.name);
      textField.setFontSize(8);
      textField.setText(streetAddressText[index] || '');
    });

    // Municipality and City
    form.getTextField('City').setText(offer.city || '');
    form.getTextField('County').setText(offer.county || '');

    // Purchase Price (numeric)
    form.getTextField('PurchasePrice').setText(offer.purchasePrice ? `${offer.purchasePrice.toFixed(2)}` : '');

    // Purchase Price Written
    const purchasePriceWrittenText = offer.purchasePrice
      ? numberToWords.toWords(offer.purchasePrice).toUpperCase()
      : '';
    const purchasePriceWrittenSplit = splitTextByCharacterLimits(purchasePriceWrittenText, fieldConfig.purchasePriceWritten);
    fieldConfig.purchasePriceWritten.forEach((field, index) => {
      const textField = form.getTextField(field.name);
      textField.setFontSize(8);
      textField.setText(purchasePriceWrittenSplit[index] || '');
    });

    // Drafted Date (today's date)
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    form.getTextField('Drafted_Date').setText(today);

    // Binding Acceptance Date and Closing Date
    const bindingAcceptanceDate = offer.bindingAcceptanceDate ? offer.bindingAcceptanceDate.toLocaleDateString('en-US') : '';
    const closingDate = offer.closingDate ? offer.closingDate.toLocaleDateString('en-US') : '';
    form.getTextField('Binding_Acceptance').setText(bindingAcceptanceDate);
    form.getTextField('Closing_Date').setText(closingDate);

    // Inclusions
    const inclusionTexts = splitTextByCharacterLimits(offer.inclusions, fieldConfig.inclusions);
    fieldConfig.inclusions.forEach((field, index) => {
      const textField = form.getTextField(field.name);
      textField.setFontSize(8);
      textField.setText(inclusionTexts[index] || '');
    });

    // Exclusions
    const exclusionTexts = splitTextByCharacterLimits(offer.exclusions, fieldConfig.exclusions);
    fieldConfig.exclusions.forEach((field, index) => {
      const textField = form.getTextField(field.name);
      textField.setFontSize(8);
      textField.setText(exclusionTexts[index] || '');
    });

    // Set Property Address
form.getTextField('Property_Address').setText(offer.fullAddress || '');

// Set Earnest Money Amount
form.getTextField('EarnesyMoneyAmount').setText(
  offer.earnestMoneyAmount ? `${offer.earnestMoneyAmount.toFixed(2)}` : ''
);

// Set Days for Earnest Money
form.getTextField('DaysForEarnestMoney').setText(
  offer.daysForEarnestMoney ? offer.daysForEarnestMoney.toString() : ''
);

// Set Earnest Money Holder
form.getTextField('EarnestMoneyHolder').setText(offer.earnestMoneyHeldBy || '');

// Set Inspection Check based on inspectionContingency
form.getTextField('InspectionCheck').setText(offer.inspectionContingency ? 'X' : 'N/A');

// Set Inspection Language
form.getTextField('InpsectionLanguage1').setText("Anything Buyer or Buyer's home inspector deems necessary");

// Set Days for Inspection
form.getTextField('DaysForInpsection').setText(
  offer.daysForInspection ? offer.daysForInspection.toString() : ''
);

// Set Right to Cure Days (placeholder of 2)
form.getTextField('RightToCureDays').setText('2');

// Set Days for Radon
form.getTextField('DaysForRadon').setText(
    offer.daysForRadon ? offer.daysForRadon.toString() : ''
  );
  
// Set Radon Check based on radonContingency
form.getTextField('RadonCheck').setText(offer.radonContingency ? 'X' : 'N/A');

// Set Financing Check based on financingContingency
form.getTextField('FinancingCheck').setText(offer.financingContingency ? 'X' : 'N/A');

// Set Financing Loan Type
form.getTextField('FinancingLoanType').setText(offer.financingTerms || '');

// Set Days for Financing
form.getTextField('DaysForFinancing').setText(
  offer.daysForFinancing ? offer.daysForFinancing.toString() : ''
);

// Set Financing Years (for both FinancingYears and YearsForFinancing fields)
const financingYearsText = offer.yearsAmortized ? offer.yearsAmortized.toString() : '';
form.getTextField('FinancingYears').setText(financingYearsText);
form.getTextField('YearsForFinancing').setText(financingYearsText);

// Set Fixed Interest Rate
form.getTextField('FixedInterestRate').setText(
    offer.financedInterestRate ? `${offer.financedInterestRate.toFixed(2)}%` : ''
  );
  
 // Set Fixed Rate Financing Check based on financingContingency (PDFCheckBox)
const fixedRateFinancingCheck = form.getCheckBox('FixedRateFinancingCheck');
offer.financingContingency ? fixedRateFinancingCheck.check() : fixedRateFinancingCheck.uncheck();
  
  // Set Seller Financing Check to N/A
  form.getTextField('SellerFinancingCheck').setText('N/A');
  
  // Set Appraisal Check based on appraisalContingency
  form.getTextField('AppraisalCheck').setText(offer.appraisalContingency ? 'X' : 'N/A');
  
  // Set Days for Appraisal
  form.getTextField('DaysForAppraisal').setText(
    offer.daysForAppraisal ? offer.daysForAppraisal.toString() : ''
  );
  
  // Set Home Sale Contingency Check to N/A
  form.getTextField('HomeSaleContingencyCheck').setText('N/A');
  
  // Set Bump Clause Check to N/A
  form.getTextField('BumpClauseCheck').setText('N/A');
  
  // Set Secondary Offer Check to N/A
  form.getTextField('SecondaryOfferCheck').setText('N/A');
  
  // Set Net General Taxes to X
  form.getTextField('NetGeneralTaxes').setText('X');
  


    // Flatten the PDF
    form.flatten();

    // Save and send the PDF
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=filled_template.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error creating PDF:', error);
    res.status(500).send('Failed to create PDF');
  }
});

module.exports = router;
