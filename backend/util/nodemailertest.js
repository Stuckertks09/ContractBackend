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

  try {
    const response = await axios.post(url, params);
    console.log('Access Token:', response.data.access_token); // Debug access token
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error);
    throw new Error('Failed to retrieve access token');
  }
}

// Function to send email
async function sendOfferEmail(buyer, emailContent) {
  const accessToken = await getAccessToken();

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Use TLS
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

