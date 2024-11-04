const formatCurrency = (amount) => amount ? `$${amount.toFixed(2)}` : '';
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '';

const conditionalText = (condition, text) => (condition ? text : '');

const TransactionEmailTemplate = (transaction, user) => {
  return `
    <p>Congratulations ${user.firstName}!</p>

    <p>Your offer has been <strong>ACCEPTED</strong>, and we are thrilled to be working towards a successful closing with you. We have listed the specific deadlines and activities that need to be met in the upcoming days for the accomplishment of our goal. Please read below:</p>

    <p><strong>Lender Application:</strong></p>
    <p>A copy of your executed contract will be emailed to your loan officer who will start the process of your loan application. They will be in touch to explain the next steps in the loan process.</p>

    <p><strong>Earnest Money:</strong></p>
    <p>The earnest money payment of ${formatCurrency(transaction.earnestMoneyAmount)} must be delivered by no later than ${formatDate(transaction.earnestMoneyDueDate)}. You will be provided with Earnest Money Instructions in a separate text or email.</p>

    <p><strong>Homeowners Insurance:</strong></p>
    <p>As part of your loan, you will be required to obtain Home Owners Insurance. We recommend reaching out to Nick Schram from CRG Services. We also recommend asking about adding service line coverage to provide protection for your underground sewer lateral and water lines.</p>

    <p>Nick Schram from CRG Services<br>
    262-424-4325 | <a href="mailto:nick.schram@crgservices.com">nick.schram@crgservices.com</a></p>

    <p><strong>Inspection Contingency:</strong></p>
    <p>${transaction.inspectionContingency 
      ? `You will be given the chance to inspect the property using a Wisconsin Registered Home Inspector. Any unacceptable defects discovered during the inspection must be addressed between you and the Seller no later than: ${formatDate(transaction.inspectionDueDate)}.` +
        conditionalText(transaction.inspectionBuffer, `<br>- As an incentive to the Seller, you have agreed to cover any defects discovered during the home inspection up to a maximum amount of: ${formatCurrency(transaction.inspectionBufferAmount)}.`)
      : 'You have waived the inspection contingency.'}</p>

    <p><strong>Appraisal Contingency:</strong></p>
    <p>${transaction.appraisalContingency 
      ? `You and/or your lender must receive an appraisal report that declares that the property is worth the agreed purchase price or more no later than: ${formatDate(transaction.appraisalDueDate)}.` +
        conditionalText(transaction.appraisalGap, `<br>- In the event that the property does not appraise, you have agreed to cover the difference between the appraised value and purchase price up to a maximum amount of: ${formatCurrency(transaction.appraisalGapAmount)}.`)
      : 'You have waived the appraisal contingency.'}</p>

    <p><strong>Finance Contingency:</strong></p>
    <p>${transaction.financingContingency 
      ? `Written loan approval from your lender, along with your consent, must be submitted to the Seller no later than: ${formatDate(transaction.financingDueDate)}.`
      : 'You have waived the financing contingency.'}</p>

    ${conditionalText(transaction.wellAndWaterContingency, 
      `<p><strong>Well and Water Contingency:</strong> The well and water contingency must be completed within ${transaction.daysBeforeClosingWellAndWater} days prior to closing.</p>`)}

    ${conditionalText(transaction.septicContingency, 
      `<p><strong>POWTS Contingency:</strong> The septic/POWTS contingency must be completed within ${transaction.daysBeforeClosingSeptic} days prior to closing.</p>`)}

    <p><strong>Utilities:</strong></p>
    <p>Once all contingencies have been removed, it’s time to setup your utilities and schedule your internet/cable for your move-in date.</p>

    <p><strong>Final Walk-Through:</strong></p>
    <p>A few days before closing, you can ensure that the property is in the same condition as when you made the offer and confirm that any necessary repairs were completed. The walk-through may be conducted on or after: ${formatDate(new Date(new Date(transaction.closingDate).setDate(new Date(transaction.closingDate).getDate() - 3)))}.</p>

    <p><strong>Closing:</strong></p>
    <p>We anticipate the closing date to be on ${formatDate(transaction.closingDate)}. We will finalize the time and location a week before closing due to scheduling conflicts between the lender and title companies.</p>

    <p><strong>*** Please confirm with your lender, me, and the title company before sending any wires. I will never communicate wire instructions via email and if you receive an email asking you to wire funds please verify they are real through multiple sources. ***</strong></p>

    <p>Thank you for choosing to work with Resilient Realty LLC. We are committed to ensuring that this is an enjoyable and stress-free experience, and we look forward to a successful closing with you.</p>

    <p>Thanks,<br>
    ${user.firstName} ${user.lastName}</p>
  `;
};

module.exports = TransactionEmailTemplate;
