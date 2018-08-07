const express = require('express');
const session = require('express-session');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const router = require('./router/index');
const path = require('path');
const cookieParser = require('cookie-parser');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const passport = require('passport');
const helpers = require('./helpers');
require('./handlers/passport');
require('./models/User');
const checkOpportunityJob = require('./controllers/CronJobController')

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

// Set a static folder to css/js and image files
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser to access the form info
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({
    secret: keys.SECRET,
    key: keys.KEY,
    resave: false,
    saveUninitialized: false
}));

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

app.use((req, res, next) => {
    res.locals.flashes = req.flash();
    res.locals.h = helpers;
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

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