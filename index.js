const bodyParser = require('body-parser');
const express = require('express');
const speech = require('@google-cloud/speech');

const app = express();

const config = {
  port: process.env.PORT || 8000,
};

app.use(
  bodyParser.raw({
    limit: 1024000,
    type: () => true,
  })
);

app.post('/asr', async (req, res) => {
  try {
    // Creates a client
    const client = new speech.SpeechClient();
    const audio = {
      content: req.body.toString('base64'),
    };

    const lang =
      req.headers['accept-language'] != null ?
        req.headers['accept-language'] :
        'en-us';
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: lang,
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join(' ');
    const confidence = response.results
      .map((result) => result.alternatives[0].confidence);
    console.log(`${Date.now()}: SUCCESS: ${transcription} - Language: ${lang}`);
    if (confidence.length >= 1) {
      res.status(200).json({
        status: 'ok',
        data: [
          {
            confidence: confidence[0],
            text: transcription,
          },
        ],
      });
    } else {
      console.log(`${Date.now()}: Returning 500.`);
      res.status(500).send('err');
    }
  } catch (error) {
    console.log(`${Date.now()}: ERROR: ${error}`);
    res.status(500).send('err');
  }
});

app.listen(config.port);
