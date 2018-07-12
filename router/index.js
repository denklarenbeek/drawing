const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/Files");
const mail = require("../handlers/mailer");

// Set storage engine
const storage = multer.memoryStorage();

// Init upload
const upload = multer({
  storage: storage
}).single("file");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/send", async (req, res, next) => {
  
  await upload(req, res, async err => {
    if (err) {
      console.log("error by uploading file:", err);
    } else {
      console.log(`File is uploaded to the memoryStorage: ${req.file.originalname} `);
    }

    // Create a model to save in the database
    const fileUpload = new File({
      fromEmail: "<dk@bigbrother.nl>",
      fromName: '"Dennis Klarenbeek 👻"',
      email: req.body.email,
      subject: req.body.subject,
      msg: req.body.msg,
      filename: req.file.originalname
    });

    await fileUpload.save((err, file, rows) => {
      if (err) {
        console.log("error on saving in the db");
      } else {
        console.log(`database item has been created: ${file.filename}`);
      }
    });

    // Mail the uploaded attachment
    await mail.send({
      fromEmail: "dennis.klarenbeek@icloud.com",
      fromName: '"Dennis Klarenbeek 👻"',
      toEmail: req.body.email,
      toName: req.body.name,
      subject: req.body.subject,
      msg: req.body.msg,
      template: "attachment",
      attachments: [
        {
          filename: req.file.filename,
          contentType: req.file.mimetype,
          content: req.file.buffer
        }
      ]
    });
  });

  res.redirect("/");
});

module.exports = router;
