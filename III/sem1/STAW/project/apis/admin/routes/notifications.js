var express = require('express');
var router = express.Router();

router.post('/one', (req, res, next) => {
    const Notification = req.models.notificationModel;
    const data = req.body.data;
    // let notifId = data._id;
    // console.log(data);

    // Notification.findOne({_id: notifId}, (err, data) => {
    //
    // })
});

router.post('/product', (req, res, next) => {
    const Notification = req.models.notificationModel;
    let data = req.body.data;

    let user = data.user.user;
    let product = data.product.name;
    let content = 'Produsul ' + product + ' a fost adaugat recent de catre ' + user + '!';

    Notification({
        from: 'Platforma',
        to: '*',
        content: content
    }).save((err, data) => {
        if(err) {
            throw err;
        }
    });
    res.status(200).json({msg: "ok"});
});

router.post('/all', (req, res, next) => {
    const Notification = req.models.notificationModel;
    const userId = req.body.data;

    Notification.find({
        to: {
            $in: [
                userId, '*'
            ]
        },
        seen: false
    }, (err, data) => {
        if (err) {
            res.status(400).json({msg: "something went bad"});
        }

        console.log('notificari: ', data);
        res.status(200).json(data);

        Notification.update({
            to: userId,
            seen: false
        }, {
            seen: true
        }, (err, rawResponse) => {
            if (err) {
                throw err;
            }
        });
    });
});

router.post('/add', (req, res, next) => {
    const Notification = req.models.notificationModel;
    const data = req.body.data;

    Notification({}).save((err, data) => {
        if (err) {
            throw err;
        }

        res.status(200).json({msg: "Notification added"});
    });
});

module.exports = router;