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

app.post('/asr', (req, res) => {
  // Creates a client
  const client = new speech.SpeechClient();

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: req.body.toString('base64'),
  };

  const lang = req.headers.language != null ? req.headers.language : "en-us";
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
  client
    .recognize(request)
    .then((data) => {
      const response = data[0];
      const result = response.results[0].alternatives[0];
      console.log(`${Date.now()}: SUCCESS: ${result}`);
      res.status(200).json({
        status: 'ok',
        data: [
          {
            confidence: result.confidence,
            text: result.transcript,
          },
        ],
      });
    })
    .catch((err) => {
      console.log(`${Date.now()}: ERROR: ${err}`);
      res.status(500).send('err');
    });
});

app.listen(config.port);
