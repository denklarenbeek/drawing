const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/Files");
const mail = require("../handlers/mailer");

// Set storage engine
const multerOptions = {
    storage: multer.memoryStorage()
};

// Init upload
exports.upload = multer(multerOptions).single("file");

exports.saveActionToDB = async (req, res, next) => {
    // Create a model to save in the database
    const fileUpload = new File({
        fromEmail: req.user.email,
        fromName: req.user.name,
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
    next();
};

exports.sendMail = async (req, res) => {
    // Mail the uploaded attachment
    await mail.send({
      fromEmail: req.user.email,
      fromName: req.user.name,
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
    res.redirect('/');
};
