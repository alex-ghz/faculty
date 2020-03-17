var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');

require('dotenv').config();

var indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const notificationRouter = require('./routes/notifications');
const cartRouter = require('./routes/cart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', 3030);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.use((req, res, next) => {
    if (req.body.api_key !== process.env.SECRET) {
       res.status(401);
       res.json("Invalid api key");
    } else {
        next();
    }
});

// DB initialise
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-zscjk.mongodb.net/db_electric?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

// Models section
const adminModel = require('./models/adminModel');
const productModel = require('./models/productModel');
const userModel = require('./models/userModel');
const notificationModel = require('./models/notificationModel');
const categoryModel = require('./models/categoryModel');
const orderModel = require('./models/orderModel');
const orderDetailsModel = require('./models/orderDetailsModel');
const models = {
    adminModel: adminModel(mongoose),
    productModel: productModel(mongoose),
    userModel: userModel(mongoose),
    notificationModel: notificationModel(mongoose),
    categoryModel: categoryModel(mongoose),
    orderModel: orderModel(mongoose),
    orderDetailsModel: orderDetailsModel(mongoose)
};

app.use('/notifications', (req, res, next) => {
    req.models = models;
    next();
}, notificationRouter);
app.use('/products', (req, res, next) => {
    req.models = models;
    next();
}, productsRouter);
app.use('/cart', (req, res, next) => {
    req.models = models;
    next();
}, cartRouter);
app.use('/', (req, res, next) => {
    req.models = models;
    next();
}, indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).json({msg: "failed"});
});

module.exports = app;
