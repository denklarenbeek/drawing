const express = require("express");
const router = express.Router();

const sendDrawingController = require('../controllers/SendDrawingController');
const authController = require('../controllers/AuthController');
const priceCastController = require('../controllers/priceCastController');
const productsController = require('../controllers/productsController');

router.get("/", authController.isLoggedIn, (req, res) => {
  res.render("index");
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
    res.render('register')
});

router.post('/register', 
    authController.isLoggedIn, 
    authController.isAdmin, 
    authController.register
);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/pcf', authController.isLoggedIn, (req, res) => {
    res.render('pcf')
});

router.get('/products', (req, res) => {
    res.render('pcfEdit');
});

// api endpoints
router.get('/api/v1/calculate-roi', authController.isLoggedIn, priceCastController.calculateROI);
router.post('/api/v1/products', productsController.createProduct);

module.exports = router;
