const express = require('express');
const router = express.Router();
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config(); 

// Middleware for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage path

// DocuSign API configuration
const { ACCOUNT_ID, INTEGRATOR_KEY, PRIVATE_KEY, USER_ID } = process.env;

// Initialize the DocuSign client
const getDocusignClient = (accessToken) => {
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath('account-d.docusign.com'); // Adjust for production if needed
  apiClient.setBasePath('https://demo.docusign.net/restapi'); // Sandbox endpoint
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
  return apiClient;
};

// Route to generate consent URL
router.get('/generate-consent', (req, res) => {
  const apiClient = new docusign.ApiClient();
  const redirectUri = `http://localhost:5001/callback`; // Callback URL

  // Define necessary scopes for consent
  const scopes = ['signature', 'impersonation'];

  // Generate the consent URL
  const consentUrl = apiClient.getAuthorizationUri(
    INTEGRATOR_KEY, // Your Integrator Key
    redirectUri,
    scopes,
    USER_ID // User ID
  );

  console.log('Integrator Key:', INTEGRATOR_KEY);

  // Redirect user to consent page
  res.redirect(consentUrl);
});

// Callback route to handle DocuSign consent
router.get('/callback', async (req, res) => {
  const { code } = req.query; // Capture the authorization code
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    const apiClient = new docusign.ApiClient();
    const tokenResponse = await apiClient.getToken(
      INTEGRATOR_KEY,
      USER_ID,
      code, // Authorization code received from the consent flow
      PRIVATE_KEY // Your RSA private key
    );

    const accessToken = tokenResponse.body.access_token; // Extract the access token

    // You can now use the access token to create the DocuSign client
    const client = getDocusignClient(accessToken);
    res.send('Consent granted! Access token received.'); // Inform the user
  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    res.status(500).send('Error exchanging authorization code');
  }
});

// Endpoint to create an envelope
router.post('/create-envelope', upload.single('file'), async (req, res) => {
  try {
    const { recipients } = req.body;
    const file = req.file;

    // Read and encode the file
    const fileBase64 = fs.readFileSync(path.resolve(file.path)).toString('base64');

    const envelopeDefinition = {
      status: 'sent',
      emailSubject: 'Please sign this document',
      documents: [
        {
          documentBase64: fileBase64,
          name: file.originalname,
          fileExtension: 'pdf',
          documentId: '1',
        },
      ],
      recipients: {
        signers: recipients.map((recipient, index) => ({
          email: recipient.email,
          name: recipient.name,
          recipientId: String(index + 1),
          clientUserId: recipient.method === 'inApp' ? String(1000 + index) : undefined,
          tabs: {
            signHereTabs: [
              {
                anchorString: `/signer${index + 1}/`, // Adjust based on document
                anchorYOffset: '10',
                anchorUnits: 'pixels',
                documentId: '1',
                pageNumber: '1',
              },
            ],
          },
        })),
      },
    };

    // Create the DocuSign client with the valid access token
    const apiClient = getDocusignClient(req.headers.authorization.split(' ')[1]); // Extract access token from request headers
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const results = await envelopesApi.createEnvelope(ACCOUNT_ID, { envelopeDefinition });
    const envelopeId = results.envelopeId;

    // Generate embedded signing URLs for in-app signers
    const signingUrls = {};
    for (const recipient of recipients) {
      if (recipient.method === 'inApp') {
        const viewRequest = {
          returnUrl: 'http://localhost:5001/signingComplete', // Specify where to redirect after signing
          authenticationMethod: 'none',
          userName: recipient.name,
          email: recipient.email,
          clientUserId: String(1000 + index),
        };
        const recipientView = await envelopesApi.createRecipientView(
          ACCOUNT_ID,
          envelopeId,
          { recipientViewRequest: viewRequest }
        );
        signingUrls[recipient.email] = recipientView.url;
      }
    }

    // Clean up the uploaded file
    fs.unlinkSync(file.path);

    res.status(200).json({ envelopeId, signingUrls });
  } catch (error) {
    console.error('Error creating envelope:', error);
    res.status(500).json({ message: 'Error creating envelope' });
  }
});

module.exports = router;
