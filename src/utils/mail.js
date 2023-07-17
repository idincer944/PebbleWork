const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = (to, link) => {
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
    subject: 'Verify your email',
    text: 'Welcome',
    html: `<div>
            <h1>Welcome to our website</h1>
            <a href=${link}>Click here to verify your email</a>
        </div>`,
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
