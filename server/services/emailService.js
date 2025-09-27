const nodemailer = require('nodemailer');
const LiveMatch = require('../models/LiveMatch');
const Alert = require('../models/Alert');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

// Check generic alerts (existing)
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

// Send reminders before a match goes live
const MATCH_REMINDER_MINUTES = 10; // Reminder window

const sendMatchReminders = async () => {
  try {
    const now = new Date();
    const soon = new Date(now.getTime() + MATCH_REMINDER_MINUTES * 60000);
    const matches = await LiveMatch.find({
      startTime: { $gte: now, $lt: soon },
      status: 'scheduled'
    });

    if (!matches.length) return;
    const users = await User.find({ 'preferences.emailNotifications': true });

    for (const match of matches) {
      for (const user of users) {
        await sendEmail(
          user.email,
          `Match Reminder: ${match.teams}`,
          `<h2>Cricket Match Starting Soon!</h2>
          <p><b>${match.teams}</b> is starting at ${match.startTime.toLocaleString()}.</p>
          <p>- CricketTrack</p>`
        );
      }
      match.status = 'reminder-sent'; // optional: update to avoid duplicates
      await match.save();
    }
    console.log(`Sent reminders for ${matches.length} matches`);
  } catch (err) {
    console.error('Error sending match reminders:', err.message);
  }
};

module.exports = {
  sendEmail,
  checkMatchAlerts,
  sendMatchReminders
};
