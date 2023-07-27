const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = (to, link,username) => {
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
    html: `<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
  
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
  
      .header h1 {
        color: #007BFF;
        font-size: 28px;
        margin: 0;
      }
  
      .button {
        display: inline-block;
        background-color: #007BFF;
        color: #fff;
        text-decoration: none;
        padding: 14px 30px;
        border-radius: 25px;
        font-weight: bold;
        text-transform: uppercase;
        transition: background-color 0.2s ease-in-out;
      }
  
      .button:hover {
        background-color: #0056b3;
      }
  
      .instructions {
        text-align: center;
        margin-top: 30px;
      }
  
      .instructions p {
        font-size: 16px;
        margin: 10px 0;
      }
  
      .closing {
        text-align: center;
        margin-top: 40px;
      }
  
      .closing p {
        font-size: 18px;
        margin: 10px 0;
      }
  
      .signature {
        text-align: center;
        margin-top: 20px;
        font-style: italic;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Our Website! 🎉</h1>
      </div>
      <div class="content">
        <p>Dear <strong>${username}</strong>,</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        <p class="instructions">
          <a class="button" href="${link}">Verify Email</a>
        </p>
        <p>If the button above doesn't work, you can also copy and paste the following link into your browser's address
          bar:</p>
        <p>${link}</p>
        <p>If you didn't sign up for an account on our website, you can safely ignore this email. 🙅‍♂️</p>
        <div class="closing">
          <p>Thank you for joinig us! 💙</p>
          <p>Best regards, 👋</p>
          <p>Cigkoftes team 🌟</p>
        </div>
        <div class="signature">
          <p>Make the world a better place 🔥</p>
        </div>
      </div>
    </div>
  </body>`,
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
