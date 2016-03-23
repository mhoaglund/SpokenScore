var fs = require("fs");
var uuid = require('uuid');
//TODO:
//Determine if this module is the right place to create a stack of time features (frames)
//from this score.
module.exports = {
    Score: function(){
        var obj;
        fs.readFile('./score.json', 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            return obj;
        });
    },
    //to be constructed from 1 or more ScoreSteps and AmbientSteps
    //begs the question of how time is notated and maintained
    Frame: function(_obj){
        this.FrameIndex = 0;
        this.Priority = 0;
        this.ID
        this.ApproxTimeCue = 0;
        this.ScoreStep = {};
    }
}