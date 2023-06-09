var createError = require('http-errors');
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var cors = require('cors');

var indexRouter = require('./routes/index');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(cookieParser());
app.use(cors());

app.use('/api', indexRouter);

// Catch 404
app.use(function(req,res,next) {
    next(createError(404));
})

app.use(function(req,res,next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;