const nodemailer = require('nodemailer');

async function sendEmail() {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com',     // Your Gmail
        pass: 'your_password',             // Your Gmail password (NOT App password)
      },
    });

    let info = await transporter.sendMail({
      from: '"Your Name" <your_email@gmail.com>',  // Sender name and email
      to: 'recipient@example.com',                 // Recipient email
      subject: 'Hello from Nodemailer',            // Subject line
      text: 'This is a test email sent from Node.js!', // Plain text body
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendEmail();
