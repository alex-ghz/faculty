const express = require('express');
const router = express.Router();
const request = require('request');

function check(req, res, next) {
    if (req.session.isLogged === undefined) {
        req.session.isLogged = false;
    }

    next();
}

router.get('/', (req, res, next) => {
    const logged = req.session.isLogged;

    if (!logged) {
        res.render('login');
    } else {
        const account = req.session.user.account;
        res.render('cont', {cont: account});
    }
});

router.post('/login', (req, res, next) => {
    let data = req.body;

    if (data.register) {
        request(process.env.API_ADMIN + 'register', {
            json: true,
            method: "POST",
            body: {
                api_key: process.env.API_ADMIN_KEY,
                data: data
            }
        }, (err, response, data) => {
            if (err) {
                res.status(404).json({msg: "Admin API down. Try again later"});
            } else {
                if (data.err) {
                    res.status(response.statusCode).json({msg: data.msg});
                } else {
                    if (!data.err) {
                        req.session.user = data.data;
                        req.session.isLogged = true;
                        res.status(200).json({msg: 'ok'});
                    } else {
                        res.status(400).json({msg: "bad"});
                    }
                }
            }
        });
    } else {
        request(process.env.API_ADMIN + 'login', {
            json: true,
            method: "POST",
            body: {
                api_key: process.env.API_ADMIN_KEY,
                is_admin: false,
                data: data
            }
        }, (err, response, data) => {
            if (err) {
                res.status(404).json({msg: "Admin API down. Try again later"});
            } else {
                if (data.err) {
                    res.status(response.statusCode).json({msg: data.msg});
                } else {
                    req.session.user = data;
                    req.session.isLogged = true;
                    res.status(response.statusCode).json({msg: 'ok'});
                }
            }
        });
    }
});

module.exports = router;
