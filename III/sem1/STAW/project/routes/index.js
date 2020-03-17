var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (typeof req.session.user == 'object') {
        res.render('index', {cont: req.session.user.account});
    } else {
        res.render('index', {title: 'Express'});
    }
});

module.exports = router;
