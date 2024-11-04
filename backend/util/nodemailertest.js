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

// Function to send email using Microsoft Graph API
async function sendOfferEmail(buyer, emailContent) {
  const accessToken = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/users/${userEmail}/sendMail`;

  const emailData = {
    message: {
      subject: 'New Offer Summary',
      body: {
        contentType: 'Text',
        content: emailContent
      },
      toRecipients: [
        {
          emailAddress: {
            address: buyer.email
          }
        }
      ],
      from: {
        emailAddress: {
          address: userEmail
        }
      }
    }
  };

  try {
    const response = await axios.post(url, emailData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.data : error);
  }
}

module.exports = { sendOfferEmail };
