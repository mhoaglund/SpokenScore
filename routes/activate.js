var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var TwilioClient = require('twilio')('AC2d10e94573181f71381ade88e618e0e2', 'dc7251dc4630e688c7d78d28992a8788');
var async = require('async');

router.get('/', function (req, res) {
        if (!global.isStarted) {
            TwilioClient.queues(global.queueSid).members.list(function (err, data) {
                data.queueMembers.forEach(function (member) {
                    global.callerPool.push(member.callSid);
                });
            });
            global.isStarted = true;
        }
    res.render('index', { title: 'Express' });
});

module.exports = router;