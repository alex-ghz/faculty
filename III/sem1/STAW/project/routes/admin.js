const express = require('express');
const router = express.Router();
const request = require('request');

function checkAdmin(req, res, next) {
    if (req.session.isAdmin === undefined) {
        req.session.isAdmin = false;
    }

    next();
}

router.get('/', checkAdmin, function(req, res, next) {
    const auth = req.session.isAdmin;
    if (!auth) {
        res.render('ad-login');
    } else {
        res.render('ad-index');
    }
});

router.post('/login', function(req, res, next) {
    processEvent('login', req.body,
        (err, response, data) => {
            if (err) {
                res.status(404).json({msg: "Admin API down. Try again later"});
            } else {
                if (data.err) {
                    res.status(response.statusCode).json({msg: data.msg});
                } else {
                    req.session.user = 'admin';
                    req.session.isAdmin = true;
                    res.status(response.statusCode).json({msg: 'ok'});
                }
            }
        });
});

router.post('/section', function(req, res, next) {
    const page = req.body.data.toLowerCase();
    const pageNo = req.body.No ? req.body.No : 0;

    switch (page) {
        case 'produse':
            processEvent(
                'products/getProducts/' + pageNo,
                [],
                (err, response, data) => {
                    if (err) {
                        throw err;
                    }
                    res.render('ad-produse', {
                        produse: data.produse,
                        categorii: data.categorii
                    });
                });
            break;
        case 'contul meu':
            res.render('detalii-cont', {cont: req.session.user.account});
            break;
        case 'notifica':
            createNotification();
            res.status(200).json('no template needed');
            break;
        case 'categorii':
            processEvent('products/getCategories',
                [],
                (err, response, data) => {
                    res.render('ad-categorii', {categorii: data});
                });
            break;
        case 'clienti':
            processEvent('getClients',
                [],
                (err, response, data) => {
                    res.render('ad-clienti', {clienti: data.data});
                });
            break;
        case 'comenzi':
            processEvent('getOrderds',
                [],
                (err, response, data) => {
                    res.render('ad-comenzi', {comenzi: data.data});
                });
            break;
        case 'distribuitori':
            processEvent('getDistribuitors',
                [],
                (err, response, data) => {

                });
            break;
        default:
            res.status(201).json('no template needed');
            break;
    }
});

router.post('/scriptsManager', function(req, res, next) {
    let page = req.body.data.toLowerCase();

    switch (page) {
        case 'produse':
            res.json([
                {value: 'product-info.js'}
            ]);
            break;
        case 'contul-meu':
            res.json([
                {value: 'notificari.js'}
            ]);
            break;
        case 'categorii':
            res.json([
                {
                    value: 'ad-categorii.js'
                }
            ]);
            break;
        default:
            res.status(201).json({msg: "no script needed"});
            break;

    }

});

router.post('/getCategories', (req, res, next) => {
    processEvent(
        'getCategories',
        [],
        (err, response, data) => {
            res.status(200).json({data: data});
        });
});

router.post('/addCategory', (req, res, next) => {
    let data = req.body;

    processEvent('products/categoryAdd', data, (err, response, data) => {
        res.json(data);
    });
});

router.post('/addProduct', function(req, res, next) {
    request(process.env.API_ADMIN + 'products/addProduct', {
        json: true,
        method: "POST",
        body: {
            api_key: process.env.API_ADMIN_KEY,
            data: req.body
        }
    }, (err, response, data) => {
        if (err) {
            res.status(404).json({msg: "Admin API down. Try again later"});
        } else {
            if (data.err) {
                res.status(response.statusCode).json({msg: data.msg});
            } else {
                processEvent(
                    'notifications/product',
                    {
                        user: req.session,
                        product: req.body
                    },
                    (err, response, data) => {
                        if (err) {
                            throw err;
                        }

                        res.status(response.statusCode).json({msg: 'ok'});
                    }
                );
            }
        }
    });
});

router.post('/addNotif', function(req, res, next) {
    request(process.env.API_ADMIN + 'notifications/add', {
        json: true,
        method: "POST",
        body: {
            api_key: process.env.API_ADMIN_KEY,
            data: req.body
        }
    }, (err, response, data) => {
        if (err) {
            res.status(404).json({msg: "Admin API down. Try again later"});
        } else {
            if (data.err) {
                res.status(response.statusCode).json({msg: data.msg});
            } else {
                req.session.user = 'admin';
                req.session.isAdmin = true;
                res.status(response.statusCode).json({msg: 'ok'});
            }
        }
    });
});

function createNotification() {
    request(process.env.API_ADMIN + 'notifications/add', {
        json: true,
        method: "POST",
        body: {
            api_key: process.env.API_ADMIN_KEY
        }
    }, (err, response, data) => {
        // if (err) {
        //     res.status(404).json({msg: "Admin API down. Try again later"});
        // }

    });
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

module.exports = router;
