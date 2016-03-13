var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var TwilioClient = require('twilio')('AC2d10e94573181f71381ade88e618e0e2', 'dc7251dc4630e688c7d78d28992a8788');

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