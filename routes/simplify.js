const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const { CloudantV1 } = require('@ibm-cloud/cloudant');

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_API_KEY
});

const cloudant = CloudantV1.newInstance({
  authenticator: authenticator,
  serviceUrl: process.env.CLOUDANT_URL,
});

const dbName = 'simplifications';

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/simplify', async (req, res) => {
  const userText = req.body.content;

  try {
    // Sample NLU call here if needed
    const analysisResult = await axios({
      method: 'post',
      url: `${process.env.NLU_URL}/v1/analyze?version=2021-08-01`,
      auth: {
        username: 'apikey',
        password: process.env.NLU_API_KEY
      },
      headers: { 'Content-Type': 'application/json' },
      data: {
        text: userText,
        features: { keywords: {} }
      }
    });

    const simplifiedText = `Simplified: ${userText}`;

    await cloudant.postDocument({
      db: dbName,
      document: {
        original: userText,
        simplified: simplifiedText
      }
    });

    res.render('result', {
      original: userText,
      simplified: simplifiedText,
      keywords: analysisResult.data.keywords
    });

  } catch (err) {
    console.error(err);
    res.send('Error: ' + err.message);
  }
});

module.exports = router;
