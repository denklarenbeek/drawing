const express = require("express");
const multer = require("multer");
const File = require("../models/Files");
const User = require('../models/User');
const mail = require("../handlers/mailer");
const cloudinary = require('cloudinary');
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
            req.file.db_id = file._id;
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
      cc: req.user.email,
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
    req.flash('success', `Your file has been uploaded and send to ${req.body.email}`);
    res.redirect('/');
};

exports.uploadToCloud = async (req, res, next) => {
    cloudinary.v2.uploader.upload_stream({resource_type: 'raw'}, 
        async function(error, result) {
            if(error) {
                console.log(error);
                next();
            }
            const file = await File.findById(req.file.db_id);
            file.fileurl = result.url
            await file.save();
            console.log('Picture is uploaded and added to db');
        })
        .end(req.file.buffer);
    next();
};
