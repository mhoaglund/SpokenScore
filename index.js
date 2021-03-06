
var express = require('express'),
path = require('path'),
winston = require('winston'),
async = require('async'),
nconf = require('nconf'),
score = require('./score');
var scoreInstance = new score('./score.json');
nconf.argv().file({file: 'config.json'});
winston.add(winston.transports.File, { filename: nconf.get('logFile') });

var routes = require('./routes/main');
var activate = require('./routes/activate');
// var call = require('./routes/Call');
var drop = require('./routes/drop');
// var _deactivate = require('./routes/DeActivate');
// var fallback = require('./routes/Fallback');
var queue = require('./routes/queue');
// var moment = require('./routes/Moment');

var app = express();


//test comment
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
global.myAddress = score.Score.Options.BaseURL;
global.queuename = score.Score.Meta.Title;
global.queueSid = 0;

var twilio = require('twilio');
global.TwilioClient = require('twilio')(nconf.get('twilioAccountKey'), nconf.get('twilioAuthToken'));

if(score.Score.Options.ProgressionType == "Stepped"){
    global.TwilioClient.queues.list(function (err, data) {
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
}

//TODO: get to the bottom of the design reasoning behind this pair of arrays.
function RedirectCall(callsid, destination){
    TwilioClient.calls(callsid).update({
        url: global.myAddress + "/" + destination,
        method: "GET"
    }, function(){
        global.callerPool.remove(callsid);
        global.runningCallers.push(callsid);
    });
}

//when a caller drops but we want to preserve a feature, we have to rebuild
//some following frames.
function RecoverFeaturesForFrames(droppedCaller, score){
    
}

//TODO: centralized time management
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