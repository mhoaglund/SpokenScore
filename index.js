var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');
var async = require('async');
winston.add(winston.transports.File, { filename: 'activity.log' });

var routes = require('./routes/index');
var users = require('./routes/users');
// var activate = require('./routes/Activate');
// var call = require('./routes/Call');
// var calldropped = require('./routes/CallDropped');
// var _deactivate = require('./routes/DeActivate');
// var fallback = require('./routes/Fallback');
var queue = require('./routes/Queue');
// var moment = require('./routes/Moment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
// app.use('/Activate', activate);
// app.use('/Call', call);
// app.use('/CallDropped', calldropped);
// app.use('/DeActivate', _deactivate);
// app.use('/Fallback', fallback);
app.use('/Queue', queue);
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

global.queuename = 'spokenscore';
global.queueSid = 0;
//initial check/create of our queue
var twilio = require('twilio');
var TwilioClient = require('twilio')('AC2d10e94573181f71381ade88e618e0e2', 'dc7251dc4630e688c7d78d28992a8788');

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

module.exports = app;