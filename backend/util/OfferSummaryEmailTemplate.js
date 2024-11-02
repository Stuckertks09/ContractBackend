const formatCurrency = (amount) => amount ? `$${amount.toFixed(2)}` : '';
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '';

const conditionalText = (condition, text) => (condition ? text : '');

const OfferSummaryEmailTemplate = (offer, user) => {
  return `
    Offer Summary: ${offer.offerName || 'N/A'}
    Purchase Price: ${formatCurrency(offer.purchasePrice)}
    Binding Acceptance: ${formatDate(offer.bindingAcceptance)}
    Earnest Money: ${formatCurrency(offer.earnestMoneyAmount)}
    Closing Date: ${formatDate(offer.closingDate)}

    Inclusions: ${offer.listing?.inclusions || 'None'}
    Exclusions: ${offer.listing?.exclusions || 'None'}

    ${offer.inspectionContingency ? 
      `Inspection Contingency: You will have ${offer.daysForInspection} days to complete the home inspection.` +
      conditionalText(offer.inspectionBuffer, ` As an incentive to the Seller, you have agreed to cover any defects discovered during the home inspection up to a maximum amount of: ${formatCurrency(offer.inspectionBufferAmount)}.`) : 
      'You have waived the inspection contingency.'}

    ${offer.appraisalContingency ? 
      `Appraisal Contingency: The lender will have ${offer.daysForAppraisal} days to complete the appraisal.` +
      conditionalText(offer.appraisalBuffer, ` In the event that the property does not appraise, you have agreed to cover the difference between the appraised value and purchase price up to a maximum amount of: ${formatCurrency(offer.appraisalBufferAmount)}.`) : 
      'You have waived the appraisal contingency.'}

    ${offer.financingContingency ? 
      `Financing Contingency: The lender will have ${offer.daysForFinancing} days to approve your loan and deliver a copy of the loan commitment.` : 
      'You have waived the financing contingency.'}

    ${conditionalText(offer.wellAndWaterContingency, 
      `Well and Water Contingency: The well and water contingency must be completed within ${offer.daysBeforeClosingWellAndWater} days prior to closing.`)}

    ${conditionalText(offer.septicContingency, 
      `POWTS Contingency: The septic/POWTS contingency must be completed within ${offer.daysBeforeClosingSeptic} days prior to closing.`)}

    ${conditionalText(offer.escalationClause, 
      `Escalation Clause: The Buyer agrees to pay ${formatCurrency(offer.escalationBeatOfferBy)} more than any competing offer up to a maximum amount of ${formatCurrency(offer.escalationMaxPurchasePrice)}.`)}

    If you have any questions or want to make any last-minute changes to your Offer before you sign, please reach out right away!

    Thanks,

    ${user.firstName} ${user.lastName}
  `.replace(/^\s+|\s+$/gm, '').replace(/\n\s*\n/g, '\n');
};

module.exports = OfferSummaryEmailTemplate;

