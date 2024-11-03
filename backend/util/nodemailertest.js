const nodemailer = require('nodemailer');
const axios = require('axios');

// Azure AD credentials
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const tenantId = 'YOUR_TENANT_ID';
const userEmail = 'your-outlook-email@example.com';

// Function to get the access token
async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', 'https://graph.microsoft.com/.default');

  const response = await axios.post(url, params);
  return response.data.access_token;
}

// Function to send email
async function sendOfferEmail(buyer, emailContent) {
  const accessToken = await getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      type: 'OAuth2',
      user: userEmail,
      accessToken: accessToken
    }
  });

  const mailOptions = {
    from: userEmail,
    to: buyer.email,
    subject: 'New Offer Summary',
    text: emailContent
  };

  await transporter.sendMail(mailOptions);
}
