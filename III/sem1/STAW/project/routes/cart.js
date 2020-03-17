const express = require('express');
const router = express.Router();
const request = require('request');

// NODE MAILER
const nodemailer = require('nodemailer');
var emailUser = 'leapsauaic@gmail.com';
var emailPass = '2xYu2kdyx9tWtmC';
//////////////////////////////////////////

router.get('/', (req, res, next) => {
    res.render('cart');
});

router.post('/products', (req, res, next) => {
    let products = req.body;

    normalizeProducts(products)
        .then(
            result => {
                processEvent('products/getProductsByIds',
                    result,
                    (err, response, data) => {
                        if (err) {
                            throw err;
                        }

                        combineDatas(data, result)
                            .then(
                                result => {
                                    res.status(200).json(result);
                                }
                            );
                    });
            }
        );
});

router.post('/placeOrder', (req, res, next) => {
    let data = req.body;

    processEvent('cart/placeOrder', data,
        (err, response, data) => {
            if (err) {
                throw err;
            }
            let failed = data.err;

            if (!failed) {
                let postas = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    auth: {
                        user: emailUser,
                        pass: emailPass
                    }
                }).on('error', err => {
                    throw err;
                });

                const mailOptions = {
                    from: emailUser,
                    to: data.data.email,
                    subject: 'Comanda ta a fost plasata!',
                    html: "<h1>Yo moni safe wit us! <3 </h1>"
                };

                postas.sendMail(mailOptions, (err, data) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        });

    res.status(200).json({msg: "ok"});
});

function combineDatas(dbData, localData) {
    return new Promise(resolve => {
        let response = [];

        dbData.forEach(product => {
            var temp = {};

            temp.name = product.name;
            temp.price = {
                value: product.specifics.price.value,
                moneda: product.specifics.price.moneda
            };
            temp.cantitate = localData[product._id];

            response.push(temp);
        });

        resolve(response);
    });
}

function normalizeProducts(products) {
    return new Promise((resolve) => {
        let data = {};

        products.forEach(productId => {
            if (!data[productId]) {
                data[productId] = 1;
            } else {
                data[productId]++;
            }
        });

        resolve(data);
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
