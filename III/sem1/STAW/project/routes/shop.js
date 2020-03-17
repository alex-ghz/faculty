const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', function(req, res, next) {
    res.render('shop', {title: 'Express'});
});

router.post('/product', function(req, res, next) {
    let data = req.body;

    res.render('product', {produs: data});
});

router.post('/productIds', function(req, res, next) {
    let data = req.body;

    processEvent(
        'products/getShop',
        data,
        (err, response, data) => {
            if (err) {
                throw err;
            }

            res.status(200).json(data);
        });
});

router.post('/filter', function(req, res, next) {
    let filter = req.body.filter;

    res.render('filter', filter);
});

function getProducts() {
    return makeRequest('getProducts');
}

function getFilters() {
    return makeRequest('getFilters');
}

function processEvent(url, data = [], cb) {
    request(process.env.API_ADMIN + url,
        {
            json: true,
            method: "POST",
            body: {
                api_key: process.env.API_ADMIN_KEY,
                data: data
            }
        }, cb);
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        request(process.env.API_ADMIN + url, {
            json: true,
            method: "POST",
            body: {
                api_key: process.env.API_ADMIN_KEY,
                data: req.body
            }
        }, (err, response, data) => {
            if (err) {
                reject({msg: "O crapat"});
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = router;
