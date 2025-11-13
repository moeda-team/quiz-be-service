import nodemailer from 'nodemailer';
import { logger } from '../common/logger';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendResetPasswordEmail(to: string, resetLink: string) {
  const html = generateHtmlTemplate(resetLink);
  const plainText = `
You requested to reset your password.

Please click the link below to set a new password:
${resetLink}

If you did not request this change, you can safely ignore this email.
  `;

  try {
    await transporter.sendMail({
      from: `"No-Reply" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🔒 Reset Your Password',
      text: plainText,
      html,
    });
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    return false;
  }
}

function generateHtmlTemplate(resetLink: string) {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f1ee;
          margin: 0;
          padding: 20px;
          color: #000000;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #343434;
          color: #fff;
          padding: 24px;
          text-align: center;
        }
        .content {
          padding: 20px 24px;
        }
        .btn {
          display: inline-block;
          background-color: #007bff;
          color: #fff !important;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 20px;
        }
        .footer {
          background-color: #f7f7f7;
          font-size: 12px;
          color: #777;
          text-align: center;
          padding: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Password Reset Request</h2>
        </div>
        <div class="content">
          <p>Hi,</p>
          <p>You recently requested to reset your password. Click the button below to create a new one:</p>

          <a href="${resetLink}" class="btn">Reset Password</a>

          <p style="margin-top: 20px;">If the button doesn't work, you can open the link below:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>

          <br>
          <p>If you did not request this password reset, please ignore this message.</p>
        </div>
        <div class="footer">
          This is an automated email. Please do not reply directly.
        </div>
      </div>
    </body>
  </html>`;
}
