const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/Files');
const mail = require('../handlers/mailer');

const maxSize = 1000 * 1000;

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

// Init upload
const upload = multer({
    storage:storage,
    limits: { fileSize: maxSize }
}).single('file')

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/send', (req, res) => {
    upload(req, res, async (err) => {
        if(err){
            console.error(err)
        } else {
            // Create a model to save in the database
            const fileUpload = new File({
                fromEmail: '<dk@bigbrother.nl>',
                fromName: '"Dennis Klarenbeek 👻"',
                email: req.body.email,
                subject: req.body.subject,
                msg: req.body.msg,
                filename: req.file.filename,
                path: req.file.path
            });
            await fileUpload.save((err, file, rows) => {
                if(err) {
                    console.log('error by uploading file:', err)
                } else {
                    console.log(`File is uploaded to the diskstorage: ${file.filename} `);
                };
            });

            // Mail the uploaded attachment
            await mail.send({
                fromEmail: 'dennis.klarenbeek@icloud.com',
                fromName: '"Dennis Klarenbeek 👻"',
                toEmail: req.body.email,
                toName: req.body.name,
                subject: req.body.subject,
                msg: req.body.msg,
                template: 'attachment',
                attachments: [
                    {
                        filename: req.file.filename,
                        path: req.file.path
                    }
                ]
            });
        }
    })
    res.redirect('/');
})

module.exports = router;