const nodemailer = require('nodemailer');
require('dotenv').config();

// thsi is a general function. we use it in the specific function like (sendVerificationEmail)
// if you want to add new mail function just go to /utils/mail/mail-functions.js and add it there.
const sendEmail = (to,subject,htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_MAIL,
      pass: process.env.ADMIN_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_MAIL,
    to: to,
    subject:subject ,
    text: 'Welcome',
    html:htmlContent,
  };
  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;
