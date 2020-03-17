var express = require('express');
var router = express.Router();
const crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({title: 'Express'});
});

router.post('/register', function(req, res, next) {
    const User = req.models.userModel;
    const Notification = req.models.notificationModel;
    const dataUser = req.body.data;
    const hash = crypto.createHmac('sha256', 'electrik');

    User.findOne({email: dataUser.email}, (err, data) => {
        if (err) {
            throw err;
        }

        if (data != null) {
            res.status(404).json({
                err: true,
                msg: "There is a account with this email"
            });
        } else {
            User({
                email: dataUser.email,
                password: hash.update(dataUser.password).digest('hex').toString(),
                firstname: dataUser.firstname
            })
                .save((err, data) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json({
                        err: false,
                        data: data
                    });
                    Notification({
                        from: 'ElecTrik Team',
                        to: data._id,
                        content: "Bine ai venit pe platforma noastra! :)"
                    }).save((err, data) => {
                        if (err) {
                            throw err;
                        }
                    });
                });
        }
    });
});

router.post('/getOrderds', function(req, res, next) {
    const Orders = req.models.orderModel;

    Orders.find({}, (err, docs) => {
        if (err) {
            throw err;
        }

        res.status(200).json({data: docs});
    });
});

router.post('/getClients', function(req, res, next) {
    const User = req.models.userModel;

    User.find({}, (err, docs) => {
        if (err) {
            throw err;
        }
        res.status(200).json({data: docs});
    });
});

router.post('/login', function(req, res, next) {
    const Admin = req.models.adminModel;
    const User = req.models.userModel;
    const email = req.body.data.email;
    const password = req.body.data.password;
    const isAdminReq = req.body.data.is_admin;
    const hash = crypto.createHmac('sha256', 'electrik');

    if (isAdminReq) {
        Admin.findOne({email: email}, (err, data) => {
            if (err) {
                throw err;
            }

            if (data === null) {
                Admin.findOne({email: 'admin'}, (err, data) => {
                    if (err) {
                        throw err;
                    }

                    if (data === null) {
                        Admin({password: hash.update(process.env.DEFAULT_PASSWORD).digest('hex').toString()}).save((err, data) => {
                            if (err) {
                                throw err;
                            }
                        });
                        res.status(201).json({
                            err: true,
                            msg: 'Initialize account'
                        });

                    } else {
                        res.status(404).json({
                            err: true,
                            msg: 'Admin not found'
                        });
                    }
                });
            } else {
                const userPass = hash.update(password).digest('hex').toString();

                if (userPass === data.password) {
                    res.status(200).json({err: false});
                } else {
                    res.status(401).json({
                        err: true,
                        msg: "Wrong Password"
                    });
                }
            }
        });
    } else {
        User.findOne({email: email}, (err, data) => {
            if (err) {
                throw err;
            }

            if (data === null) {
                User.findOne({email: 'admin'}, (err, data) => {
                    if (err) {
                        throw err;
                    }

                    if (data === null) {
                        User({password: hash.update(process.env.DEFAULT_PASSWORD).digest('hex').toString()}).save((err, data) => {
                            if (err) {
                                throw err;
                            }
                        });
                        res.status(201).json({
                            err: true,
                            msg: 'Initialize account'
                        });

                    } else {
                        res.status(404).json({
                            err: true,
                            msg: 'Admin not found'
                        });
                    }
                });
            } else {
                const userPass = hash.update(password).digest('hex').toString();

                if (userPass === data.password) {
                    res.status(200).json({
                        err: false,
                        account: data
                    });
                } else {
                    res.status(401).json({
                        err: true,
                        msg: "Wrong Password"
                    });
                }
            }
        });
    }

});

module.exports = router;
