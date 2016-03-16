var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var TwilioClient = require('twilio')('AC2d10e94573181f71381ade88e618e0e2', 'dc7251dc4630e688c7d78d28992a8788');

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