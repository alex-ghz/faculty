const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/all', function (req, res, next) {
    request(process.env.API_ADMIN + 'notifications/all', {
        json: true,
        method: "POST",
        body: {
            api_key: process.env.API_ADMIN_KEY,
            is_admin: false,
            data: req.session.user._id
        }
    }, (err, response, data) => {
        if (err) {
            res.status(404).json({msg: "Admin API down. Try again later"});
        } else {
            if (data.err) {
                res.status(response.statusCode).json({exist: false, msg: data.msg});
            } else {
                if (data.length === 0) {
                    res.status(response.statusCode).json({exist: false});
                } else {
                    res.status(response.statusCode).json({exist: true, data: data});
                }
            }
        }
    });
});

router.post('/one', function (req, res, next) {
    let data = req.body.data;
    res.render('notificare', {
        notificare: {
            autor: data.from,
            continut: data.content
        }
    });
});

module.exports = router;
