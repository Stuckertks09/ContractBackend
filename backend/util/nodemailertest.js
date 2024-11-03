const nodemailer = require('nodemailer');
const axios = require('axios');

// Azure AD credentials
const clientId = 'fcd8a2d0-e5d0-4344-9b2f-70bd32f5328a';
const clientSecret = 'pBc8Q~NGgA29R_uO0ysoQF3GBW64uxT.n2rzQdwo';
const tenantId = 'd19116b8-683e-42ae-9be7-6bb1cf81191e';
const userEmail = 'KurtisStuckert@RRRHome.com';

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
