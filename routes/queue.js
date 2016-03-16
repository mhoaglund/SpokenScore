var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var TwilioClient = require('twilio')('', '');

/* GET home page. */
router.get('/', function (req, res) {
    var randomNumber = Math.random() >= 0.5;
    var twiml = new twilio.TwimlResponse();
    var chosenVoice = (randomNumber) ? global.voices[0] : global.voices[1];
    twiml.pause({ length: 45 });
    res.header('Content-Type', 'text/xml');
    res.send(twiml.toString());
});

module.exports = router;