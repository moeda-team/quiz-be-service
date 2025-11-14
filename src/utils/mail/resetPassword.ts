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
Reset Your Password

You requested to reset your password. Click the link below:
${resetLink}

If you did not request this, safely ignore this email.
`;

  try {
    await transporter.sendMail({
      from: `"Learning Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset Your Password',
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
          background: #f2f2f2;
          font-family: Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 20px;
        }

        .email-wrapper {
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .top-bar {
          padding: 20px 30px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 38px;
          height: 38px;
          background: #6a4dfd;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          font-size: 18px;
          font-weight: bold;
        }

        .title-block {
          margin: 0;
        }

        .title-block h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .divider {
          border-top: 1px solid #eaeaea;
          margin: 0;
        }

        .content {
          padding: 30px;
        }

        .content h3 {
          margin-top: 0;
          font-size: 22px;
          font-weight: 600;
        }

        .content p {
          font-size: 15px;
          color: #555;
          line-height: 1.6;
        }

        .btn {
          display: inline-block;
          background: #0d6efd;
          color: #ffffff !important;
          padding: 14px 26px;
          font-size: 16px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
        }

        .note-box {
          background: #fafafa;
          padding: 16px;
          border-radius: 6px;
          font-size: 14px;
          color: #444;
          border: 1px solid #eee;
        }

        .footer {
          font-size: 13px;
          color: #888;
          text-align: center;
          padding: 25px;
        }
      </style>
    </head>

    <body>
      <div class="email-wrapper">

        <hr class="divider" />

        <!-- Content -->
        <div class="content">
          <h3>Reset Your Password</h3>

          <p>Hi there,</p>
          <p>We received a request to reset your password for your Learning Platform account. 
          If you made this request, click the button below to reset your password.</p>

          <a href="${resetLink}" class="btn">Reset Password</a>

          <div class="note-box">
            <strong>Note:</strong> This link will expire in 24 hours. If you didn't request a password reset, you can safely ignore this email.
          </div>

          <p style="margin-top:20px;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
        </div>

        <!-- Footer -->
        <div class="footer">
          This email was sent to you automatically. If you have any questions, please contact our support team.<br>
          © 2025 Learning Platform. All rights reserved.
        </div>

      </div>
    </body>
  </html>
  `;
}
