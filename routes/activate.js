var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var TwilioClient = global.TwilioClient;
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