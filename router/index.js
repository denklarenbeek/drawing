const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/Files");
const mail = require("../handlers/mailer");

const sendDrawingController = require('../controllers/SendDrawingController');

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/send", 
    sendDrawingController.upload, 
    sendDrawingController.saveActionToDB, 
    sendDrawingController.sendMail
);

module.exports = router;
