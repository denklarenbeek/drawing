const express = require("express");
const router = express.Router();

const sendDrawingController = require('../controllers/SendDrawingController');

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/send", 
    sendDrawingController.upload, 
    sendDrawingController.saveActionToDB, 
    sendDrawingController.sendMail
);

router.get('/login', (req, res) => {
    res.render('login');
})

module.exports = router;
