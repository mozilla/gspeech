

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
        const result = '{"status":"ok","data":[{"confidence":'+ response.results[0].alternatives[0].confidence + '},"text":"' + response.results[0].alternatives[0].transcript + '"}]}';
        res.status(200).send(result);
        console.log('result 200' + `${response.results[0].alternatives[0].transcript} ` + Date.now());
        return;
    })
    .catch(err => {
        console.log('result 500:', err, Date.now());
        res.status(500).send('err');
        return;
    });
})

app.listen(3000);
