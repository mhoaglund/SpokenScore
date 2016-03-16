var express = require('express');
var path = require('path');
var winston = require('winston');
var async = require('async');
var extract = require('./extract'); //http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
winston.add(winston.transports.File, { filename: 'activity.log' });

var routes = require('./routes/main');
var activate = require('./routes/activate');
// var call = require('./routes/Call');
var drop = require('./routes/drop');
// var _deactivate = require('./routes/DeActivate');
// var fallback = require('./routes/Fallback');
var queue = require('./routes/queue');
// var moment = require('./routes/Moment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/activate', activate);
// app.use('/Call', call);
app.use('/drop', drop);
// app.use('/DeActivate', _deactivate);
// app.use('/Fallback', fallback);
app.use('/queue', queue);
// app.use('/Moment', moment);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

global.callerPool = [];
global.runningCallers = [];
global.isStarted = false;
global.voices = ['woman', 'man', 'Alice'];
global.myAddress = 'http://perfectsilhouette.azurewebsites.net';
global.queuename = 'spokenscore';
global.queueSid = 0;
//initial check/create of our queue
var twilio = require('twilio');
global.TwilioClient = require('twilio')('', '');

TwilioClient.queues.list(function (err, data) {
    data.queues.forEach(function (queue) {
        //console.log(queue.friendlyName + ' ' + queue.sid + 'currentSize: ' + queue.currentSize);
        if (queue.friendlyName == global.queuename) {
            global.queueSid = queue.sid;
            global.currentQueuedCallers = queue.currentSize;
        }
    });
    
    if (global.queueSid == 0) {
        winston.log('info', 'No queue found. Creating call queue.');
        TwilioClient.queues.create({
            friendlyName: global.queuename
        }, function (err, queue) {
            if (err) console.log(err);
            global.queueSid = queue.sid;
            global.currentQueuedCallers = 0;
        });
    }
});

function RedirectCall(callsid, destination){
    TwilioClient.calls(callsid).update({
        url: global.myAddress + "/" + destination,
        method: "GET"
    }, function(){
        global.callerPool.remove(callsid);
        global.runningCallers.push(callsid);
    });
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

module.exports = app;