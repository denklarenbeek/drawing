const nodemailer = require("nodemailer");
const keys = require("../config/keys");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");

const transport = nodemailer.createTransport({
  host: keys.MAIL_HOST,
  port: keys.MAIL_PORT,
  auth: {
    user: keys.MAIL_USER,
    pass: keys.MAIL_PASS
  }
});

const generateHtml = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  const inlined = juice(html);
  return inlined;
};

exports.send = async options => {
  const html = generateHtml(options.template, options);
  const text = htmlToText.fromString(html);

  const customFrom = `${options.fromName} <${options.fromEmail}>`;
  const mailOptions = {
    from: customFrom,
    to: options.toEmail,
    subject: options.subject,
    html: html,
    text: text,
    attachments: options.attachments
  };
  return transport.sendMail(mailOptions, (err, info) => {
    if(err) {
        console.log('There is an error with sending the file:', err)
    } else {
      console.log('file has been sent to:', info.accepted);
    };
  });
};
