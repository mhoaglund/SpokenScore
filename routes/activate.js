var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var TwilioClient = global.TwilioClient;
var async = require('async');
var score = require('../score.js'); //http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files

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