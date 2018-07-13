const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/Files");
const mail = require("../handlers/mailer");
const cloudinary = require('cloudinary');
const fs = require('fs');
const keys = require('../config/keys');

//Set Cloudinary config
cloudinary.config({ 
    cloud_name: 'denklarenbeek', 
    api_key: keys.CLOUD_KEY, 
    api_secret: keys.CLOUD_SECRET
});

// Set storage engine
const multerOptions = {
    storage: multer.memoryStorage()
};

// Init upload
exports.upload =  multer(multerOptions).single("file");

exports.saveActionToDB = async (req, res, next) => {
    console.log(req.file.url);
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

exports.uploadToCloud = async (req, res, next) => {
    await cloudinary.v2.uploader.upload_stream({resource_type: 'raw'}, {
        eager: 
        {
            width: 150, height: 100, crop: "thumb", gravity: "face"
        },
            eager_async: true, 
            eager_notification_url: "https://mysite/upload_success"
        }, 
        function(error, result){
            if(error){
                 console.log(error);
                 next();
            }
            console.log(result.url);
            req.file.url = result.url;
        })
        .end(req.file.buffer);
    next();
};
