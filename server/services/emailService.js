const nodemailer = require('nodemailer');

// Create transporter (configure based on your email provider)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailTemplates = {
  'verify-email': (data) => ({
    subject: 'Verify Your ConnectSphere Account',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1>Welcome to ConnectSphere!</h1>
        <p>Hello ${data.firstName},</p>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <a href="${data.verificationLink}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>Or copy and paste this link: ${data.verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>ConnectSphere Team</p>
      </div>
    `
  }),
  'reset-password': (data) => ({
    subject: 'Reset Your ConnectSphere Password',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1>Password Reset Request</h1>
        <p>Hello ${data.firstName},</p>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <a href="${data.resetLink}" style="padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy and paste this link: ${data.resetLink}</p>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
        <p>Best regards,<br>ConnectSphere Team</p>
      </div>
    `
  }),
  'welcome': (data) => ({
    subject: 'Welcome to ConnectSphere!',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1>Welcome ${data.firstName}!</h1>
        <p>Your account is all set up and ready to use.</p>
        <p>Start connecting with people and sharing your thoughts!</p>
        <a href="${process.env.FRONTEND_URL}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Go to ConnectSphere
        </a>
        <p>Best regards,<br>ConnectSphere Team</p>
      </div>
    `
  })
};

const sendEmail = async ({ to, subject, template, data, html }) => {
  try {
    let mailOptions;

    if (template && emailTemplates[template]) {
      const emailContent = emailTemplates[template](data);
      mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject: emailContent.subject,
        html: emailContent.html
      };
    } else {
      mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html
      };
    }

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
