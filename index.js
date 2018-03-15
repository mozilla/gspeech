

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const speech = require('@google-cloud/speech');

app.use(
    bodyParser.raw({
      limit: 1024000,
      type: function () {
        return true;
      }
    })
  );

app.post('/asr', function (req, res, next) {

    // Creates a client
    const client = new speech.SpeechClient();

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: req.body.toString('base64')
    };

    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    };

    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    client
    .recognize(request)
    .then(data => {
        const response = data[0];
        res.status(200).send(`${response.results[0].alternatives[0].transcript} - ${response.results[0].alternatives[0].confidence}`);
        return;
    })
    .catch(err => {
        res.status(500).send('err');
        return;
    });
})

app.listen(3000);
