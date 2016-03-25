var fs = require("fs");
var uuid = require('uuid');
function ExtractScore(path){
    
    var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
    return obj;
};

//TODO:
//Determine if this module is the right place to create a stack of time features (frames)
//from this score.
module.exports = ExtractScore;