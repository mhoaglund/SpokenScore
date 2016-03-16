var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var TwilioClient = global.TwilioClient;

/* GET home page. */
router.get('/', function (req, res) {
    if (!req.query.CallSid) {
        res.status(404)// HTTP status 404: NotFound
        res.send('Not found');
        return;
    }
    else{
        global.callerPool.remove(req.query.CallSid);
        global.runningCallers.remove(req.query.CallSid);
    }
    var qobj = req.query;
    var twiml = new twilio.TwimlResponse();
    res.header('Content-Type', 'text/xml');
    res.send(twiml.toString());
});

module.exports = router;