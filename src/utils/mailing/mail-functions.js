const sendEmail= require('./send-mail')

//add a new function with new htmlContent and call it from where ever you want.

module.exports={
    sendVerificationEmail : (to, link, username) => {
        const subject = 'Verify your email';
        const htmlContent =  `<head>
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
      </body>`;
        sendEmail(to, subject, htmlContent);
      },

    sendJoinedEventEmail  : (to, eventName, eventDate) => {
        const subject = `Thank You for Joining ${eventName}`;
        const htmlContent = `
        <head>
        <style>
          body {
            font-family: Arial, sans-serif;
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
      
          .content {
            font-size: 16px;
          }
      
          .content p {
            margin-bottom: 15px;
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
      
          .highlight {
            background-color: #007BFF;
            color: #fff;
            padding: 2px 5px;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Joining ! 🎉</h1>
          </div>
          <div class="content">
            <p>Dear <strong >volinteer</strong>,</p>
            <p>We are thrilled that you have decided to join the <strong >${eventName}</strong> event happening on <strong >${eventDate}</strong>.</p>
            <p>We look forward to seeing you there and hope you have a fantastic time with other attendees.</p>
            <p>If you have any questions or need further information, feel free to reach out to us.</p>
          </div>
          
          <div class="">
            <p>Thank you once again for your participation!</p>
            <p>Best regards, 👋</p>
            <p>The <span class="highlight">Cigkoftes</span> Team 🌟</p>
            <div style="text-align: center;">
             <img src="https://cdn.getiryemek.com/restaurants/1643023274713_1125x522.jpeg" alt="Cigkoftes Team" width="%100" height="150" style="border-radius: 20px;">        </div>
          </div>
          <div class="signature">
            <p>Make memories and have fun! 🎊</p>
          </div>
        </div>
      </body>
      
        `;
        sendEmail(to, subject, htmlContent);
      },
    sendLeftEventEmail :(to, eventName, eventDate) => {
        const subject = `Sorry to See You Go from ${eventName}`;
        const htmlContent = `
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
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
            
              .content {
                font-size: 16px;
              }
            
              .content p {
                margin-bottom: 15px;
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
            
              .highlight {
                background-color: #007BFF;
                color: #fff;
                padding: 2px 5px;
                border-radius: 3px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Sorry to See You Go from <strong>${eventName}</strong> 😢</h1>
              </div>
              <div class="content">
                <p>Dear Volnteer,</p>
                <p>We noticed that you have decided to leave the <strong>${eventName}</strong> event happening on <strong>${eventDate}</strong>.</p>
                <p>We hope everything is okay, and we are sorry to see you go.</p>
                <p>If you have any feedback or questions about the event, please feel free to share them with us.</p>
              </div>
              <div class="">
                <p>We hope to see you at our future events!</p>
                <p>Best regards, 👋</p>
                <p>The <strong>Cigkoftes</strong> Team 🌟</p>
                <div style="text-align: center;">
                     <img src="https://cdn.getiryemek.com/restaurants/1643023274713_1125x522.jpeg" alt="Cigkoftes Team" width="%100" height="150" style="border-radius: 20px;">                </div>
              </div>
              <div class="signature">
                <p>Take care and have a great day! 🌞</p>
              </div>
            </div>
          </body>
        `;
        sendEmail(to, subject, htmlContent);
      },
      sendCommentNotificationEmail : (to,userName,eventName, content,eventDate)=> {
        const subject = `new comment on ${eventName}`;
        const htmlContent = `<body>
        <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          <div class="header" style="text-align: center;">
            <h1 style="color: #1a237e;">New Comment on <strong>${eventName}</strong> 💬</h1>
          </div>
          <div class="content">
            <p>Dear ${userName},</p>
            <p style="margin-bottom: 15px;">We hope this email finds you well.</p>
            <p>A new comment has been added to your event <strong>${eventName}</strong>, which is happening on <strong>${eventDate}</strong>.</p>
            <p style="margin-top: 10px;"><strong>Comment:</strong></p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${content}</p>
          </div>
          <div class="">
            <p>Best regards, 👋</p>
            <p>The <strong>Cigkoftes</strong> Team 🌟</p>
            <div style="text-align: center;">
              <img src="https://cdn.getiryemek.com/restaurants/1643023274713_1125x522.jpeg" alt="Cigkoftes Team" style="max-width: 100%; height: auto; border-radius: 10px;">
            </div>
          </div>
          <div class="signature">
            <p>Take care and have a great day! 🌞</p>
          </div>
        </div>
      </body>
        `;
        sendEmail(to, subject, htmlContent);
      },
}
