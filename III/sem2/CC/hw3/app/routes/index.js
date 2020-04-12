var express = require('express');
var router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    //const Record = req.models.recordModel;

    res.render('index', {title: 'Express'});
});

//router.post('/add', function(req, res, next) {
//    const Record = req.models.recordModel;
//
//    let items = req.body.data;
//
//    items.forEach(element => {
//        Record({name: element}).save((err, data) => {
//            if (err) throw err;
//        })
//    });
//
//    //Record.find({}, (err, docs) => {
//    //    if (err) throw err;
//    //
//    //    res.render('index', {title: 'Express', docs: docs});
//    //})
//});

module.exports = router;
