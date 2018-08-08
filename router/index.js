const express = require("express");
const router = express.Router();

const sendDrawingController = require('../controllers/SendDrawingController');
const authController = require('../controllers/AuthController');
const priceCastController = require('../controllers/priceCastController');
const productsController = require('../controllers/productsController');
const generateController = require('../controllers/generateController');
const opportunityController = require('../controllers/OpportunitiesController');
const userController = require('../controllers/UserController');

router.get("/", authController.isLoggedIn, (req, res) => {
  res.render("index", {title: 'Homepage',user: req.user});
});

router.get("/drawing", authController.isLoggedIn, (req, res) => {
    res.render("drawing", {title: 'Send new drawing'});
});

router.post("/send", 
    authController.isLoggedIn,
    sendDrawingController.upload, 
    sendDrawingController.saveActionToDB, 
    sendDrawingController.uploadToCloud,
    sendDrawingController.sendMail
);

router.get('/register', 
    authController.isLoggedIn, 
    authController.isAdmin, 
    (req, res, next) => {
    res.render('register', {title: 'Register new user'});
});

router.post('/register', 
    authController.isLoggedIn, 
    authController.isAdmin, 
    authController.register
);

router.get('/login', (req, res) => {
    res.render('login', {title: 'Login'});
});

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/pcf', authController.isLoggedIn, (req, res) => {
    res.render('pcf', {title: 'Calculate PCF ROI'})
});

router.get('/create-pcf', authController.isLoggedIn, (req, res) => {
    res.render('createPcf', {title: 'Create PCF contract'});
});

router.get('/opportunities', authController.isLoggedIn, opportunityController.getAllOpportunities);
router.get('/opportunities/:id', authController.isLoggedIn, opportunityController.getOpportunity);
router.post('/opportunities/:id',  authController.isLoggedIn, opportunityController.updateOpportunity);

router.get('/opportunity', authController.isLoggedIn, (req, res) => {
    res.render('createOpp', {title: 'Create opportunity'});
});
router.post('/opportunity',  authController.isLoggedIn, opportunityController.createOpportunity);

router.get('/products', (req, res) => {
    res.render('pcfEdit', {title: 'Edit pcf'});
});

router.get('/settings', authController.isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render('settings', {title: 'Your settings', user: req.user})
});

router.get('/admin',  authController.isLoggedIn, authController.isAdmin, (req, res) => {
    res.render('admin', {title: 'Admin section'})
});

router.post('/import-opportunities', authController.isLoggedIn, authController.isAdmin, opportunityController.importOpps);


// api endpoints
router.get('/api/v1/calculate-roi', authController.isLoggedIn, priceCastController.calculateROI);
router.post('/api/v1/products', productsController.createProduct);

router.post('/api/v1/generate-pcf-contract', authController.isLoggedIn, generateController.generatePCFContract, generateController.sendContract);

router.get('/api/v1/getHistoricalOpp/:id', opportunityController.getHistoricalOpp);

router.post('/api/v1/user/timer', userController.updateJobTimer);
router.post('/api/v1/user/days', userController.updateJobDays);
router.post('/api/v1/user/cronjob', userController.updateJobActive);

module.exports = router;
