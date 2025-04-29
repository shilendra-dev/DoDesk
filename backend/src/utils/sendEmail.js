const nodemailer = require('nodemailer');

const sendEmail = async (toEmail, subject, text) => {
  try {
    // Create a transporter using Gmail SMTP and App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shelendrasingh704@gmail.com',   // Replace with your Gmail address
        pass: 'ubrv ngdf qrwt uxwz',     // Use the 16-character app password generated earlier
      },
    });

    // Email options
    const mailOptions = {
      from: 'shelendrasingh704@gmail.com',   // Replace with your Gmail address
      to: toEmail,                   // Recipient's email
      subject: subject,              // Subject of the email
      text: text,                    // Email body text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};




module.exports = {
    sendEmail
  };