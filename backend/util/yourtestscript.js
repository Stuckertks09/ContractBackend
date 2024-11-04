const { sendOfferEmail } = require('./nodemailertest');

// Sample data for testing
const testBuyer = {
  email: 'stuckertks09@gmail.com'  // Replace with your own email for testing
};

const testEmailContent = 'This is a test email to confirm that nodemailer is configured correctly.';

async function testSendEmail() {
  try {
    console.log('Attempting to send test email...');
    await sendOfferEmail(testBuyer, testEmailContent);
    console.log('Test email sent successfully.');
  } catch (error) {
    console.error('Error during test email send:', error);
  }
}

// Call the test function
testSendEmail();
