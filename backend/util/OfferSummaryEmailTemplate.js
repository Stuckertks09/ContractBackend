const formatCurrency = (amount) => amount ? `$${amount.toFixed(2)}` : '';
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '';

const conditionalText = (condition, text) => (condition ? text : '');

const OfferSummaryEmailTemplate = (offer, user) => {
  return `
    <p><strong>Offer Summary:</strong> ${offer.offerName || 'N/A'}</p>
    <p><strong>Purchase Price:</strong> ${formatCurrency(offer.purchasePrice)}</p>
    <p><strong>Binding Acceptance:</strong> ${formatDate(offer.bindingAcceptance)}</p>
    <p><strong>Earnest Money:</strong> ${formatCurrency(offer.earnestMoneyAmount)}</p>
    <p><strong>Closing Date:</strong> ${formatDate(offer.closingDate)}</p>
    
    <p><strong>Inclusions:</strong> ${offer.listing?.inclusions || 'None'}</p>
    <p><strong>Exclusions:</strong> ${offer.listing?.exclusions || 'None'}</p>

    <p>${offer.inspectionContingency ? 
      `Inspection Contingency: You will have ${offer.daysForInspection} days to complete the home inspection.` +
      conditionalText(offer.inspectionBuffer, `<br>As an incentive to the Seller, you have agreed to cover any defects discovered during the home inspection up to a maximum amount of: ${formatCurrency(offer.inspectionBufferAmount)}.`) : 
      'You have waived the inspection contingency.'}</p>

    <p>${offer.appraisalContingency ? 
      `Appraisal Contingency: The lender will have ${offer.daysForAppraisal} days to complete the appraisal.` +
      conditionalText(offer.appraisalBuffer, `<br>In the event that the property does not appraise, you have agreed to cover the difference between the appraised value and purchase price up to a maximum amount of: ${formatCurrency(offer.appraisalBufferAmount)}.`) : 
      'You have waived the appraisal contingency.'}</p>

    <p>${offer.financingContingency ? 
      `Financing Contingency: The lender will have ${offer.daysForFinancing} days to approve your loan and deliver a copy of the loan commitment.` : 
      'You have waived the financing contingency.'}</p>

    ${conditionalText(offer.wellAndWaterContingency, 
      `<p>Well and Water Contingency: The well and water contingency must be completed within ${offer.daysBeforeClosingWellAndWater} days prior to closing.</p>`)}

    ${conditionalText(offer.septicContingency, 
      `<p>POWTS Contingency: The septic/POWTS contingency must be completed within ${offer.daysBeforeClosingSeptic} days prior to closing.</p>`)}

    ${conditionalText(offer.escalationClause, 
      `<p>Escalation Clause: The Buyer agrees to pay ${formatCurrency(offer.escalationBeatOfferBy)} more than any competing offer up to a maximum amount of ${formatCurrency(offer.escalationMaxPurchasePrice)}.</p>`)}

    <p>If you have any questions or want to make any last-minute changes to your Offer before you sign, please reach out right away!</p>

    <p>Thanks,<br>
    ${user.firstName} ${user.lastName}</p>
  `;
};

module.exports = OfferSummaryEmailTemplate;
