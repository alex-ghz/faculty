var express = require('express');
var router = express.Router();

router.post('/placeOrder', (req, res, next) => {
    let Order = req.models.orderModel;
    let OrderDetails = req.models.orderDetailsModel;
    let data = req.body.data;
    let orderDetails = data.orderDetails;
    let cart = data.cart;
    cart = JSON.parse(cart);

    Order(orderDetails).save((err, data) => {
        if (err) {
            throw err;
        }

        let orderId = data._id;

        cart.forEach(key => {
            OrderDetails({
                orderId: orderId,
                productId: key
            }).save((err, data) => {
                if (err) {
                    throw err;
                }
            });
        });
        res.status(200).json({
            err: false,
            data: data,
            msg: "ok"
        });
    });
});

module.exports = router;