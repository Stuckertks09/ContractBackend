const express = require('express');
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');
const router = express.Router();
require('dotenv').config(); // Load environment variables

// DocuSign API configuration
const { INTEGRATOR_KEY, USER_ID, ACCOUNT_ID, PRIVATE_KEY_PATH } = process.env;

// Function to get JWT access token
const getJwtToken = async () => {
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath('account-d.docusign.com');

  // Read the private key from the specified path
  const privateKey = fs.readFileSync(path.resolve(PRIVATE_KEY_PATH), 'utf8');

  // Request JWT User Token
  const tokenResponse = await apiClient.requestJWTUserToken(
    INTEGRATOR_KEY,
    USER_ID,
    'signature', // Scopes you want to request
    privateKey,
    3600 // Token expiration in seconds
  );

  return tokenResponse.body.access_token; // Return the access token
};

// Route to generate consent URL
router.get('/generate-consent', (req, res) => {
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath('account-d.docusign.com');

  const redirectUri = `http://example.com/callback`; // Adjust for your local testing
  const scopes = 'signature impersonation'; // Ensure these scopes are correct

  // Generate the consent URL
  const consentUrl = apiClient.getAuthorizationUri(
    INTEGRATOR_KEY,
    redirectUri,
    scopes.split(' '), // Convert to array
    null // User ID can be null for standard authorization
  );

      // Log the full consent URL
      console.log('Consent URL being sent to DocuSign:', consentUrl);

    // Log the scopes being passed
    console.log('Scopes being passed to DocuSign:', scopes);

  // Redirect user to consent page
  res.redirect(consentUrl);
});

// Callback route to handle DocuSign consent
router.get('/callback', (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  // Here, you can exchange the authorization code for an access token.
  res.send('Consent granted! Authorization code received.');
});

module.exports = router;

module.exports = router;