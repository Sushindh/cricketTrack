const nodemailer = require('nodemailer');
const Alert = require('../models/Alert');
const User = require('../models/User');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

// Check and send match alerts
const checkMatchAlerts = async () => {
  try {
    const now = new Date();
    const alerts = await Alert.find({
      isActive: true,
      sent: false,
      triggerTime: { $lte: now }
    }).populate('userId');

    for (const alert of alerts) {
      if (alert.userId.preferences.emailNotifications) {
        await sendEmail(
          alert.userId.email,
          'Cricket Match Alert',
          `<h2>Cricket Alert</h2><p>${alert.message}</p>`
        );
      }

      alert.sent = true;
      await alert.save();
    }

    console.log(`Processed ${alerts.length} alerts`);
  } catch (error) {
    console.error('Error checking alerts:', error.message);
  }
};

module.exports = {
  sendEmail,
  checkMatchAlerts
};
