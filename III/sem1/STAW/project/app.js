var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');

require('dotenv').config();

const indexRouter = require('./routes/index');
const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');
const contulMeuRouter = require('./routes/contulMeu');
const notificariRouter = require('./routes/notificari');
const cartRouter = require('./routes/cart');

var app = express();

// view engine setup
app.set('views', [__dirname + '/views', __dirname + '/views/admin']);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(session({
    secret: 'loco contigo',
    resave: false,
    saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/shop', shopRouter);
app.use('/admin', adminRouter);
app.use('/contul-meu', contulMeuRouter);
app.use('/notificare', notificariRouter);
app.use('/cart', cartRouter);

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
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
