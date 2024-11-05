// routes/docusignRoutes.js
const express = require('express');
const router = express.Router();
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');

// Middleware for handling file uploads (e.g., using Multer)
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage path

// DocuSign API configuration
const { ACCOUNT_ID, INTEGRATOR_KEY, PRIVATE_KEY, USER_ID } = process.env;

// Initialize the DocuSign client
const getDocusignClient = () => {
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath('account-d.docusign.com'); // Adjust for production if needed
  apiClient.setBasePath('https://demo.docusign.net/restapi'); // Sandbox endpoint
  apiClient.addDefaultHeader('Authorization', `Bearer ${YOUR_ACCESS_TOKEN}`);
  return apiClient;
};

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

    const apiClient = getDocusignClient();
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const results = await envelopesApi.createEnvelope(ACCOUNT_ID, { envelopeDefinition });
    const envelopeId = results.envelopeId;

    // Generate embedded signing URLs for in-app signers
    const signingUrls = {};
    for (const recipient of recipients) {
      if (recipient.method === 'inApp') {
        const viewRequest = {
          returnUrl: 'app://signingComplete', // Mobile app redirect
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
