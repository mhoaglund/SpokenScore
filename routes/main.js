var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    //var hostname = req.get('host');
    //if (global.myAddress == ' ') global.myAddress = 'http://' + hostname;
    res.render('main', { title: 'Express' });
});

module.exports = router;