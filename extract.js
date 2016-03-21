var fs = require("fs");

module.exports = {
    scoreSet: function(){
        var obj;
        fs.readFile('./score.json', 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            return obj;
        });
    }
}