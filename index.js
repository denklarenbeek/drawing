require("dotenv").config({ path: "variables.env" });

const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./router/index');
const path = require('path');

const app = express();

const port = process.env.PORT || 8080;

const mongoURI = `mongodb://${keys.DBUSER}:${keys.DBPASS}@ds113799.mlab.com:13799/drawing`;
mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Mongoose is connected.....'))
    .catch((err) => console.log(err));


// Set EJS as the View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cookieParser());

// Set a static folder to css/js and image files
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser to access the form info
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up routes
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
        message: err.message,
        error: err
        });
    });
};

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});