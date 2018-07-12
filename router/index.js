const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/Files");
const mail = require("../handlers/mailer");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/send", async (req, res, next) => {
  
  

  res.redirect("/");
});

module.exports = router;
