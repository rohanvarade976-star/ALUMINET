const nodemailer = require('nodemailer');

const SKIP_VALUES = ['skip', 'your_email@gmail.com', 'your_gmail_app_password', 'skipskipskipskip'];

const isEmailConfigured = () => {
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').trim();
  if (!user || !pass) return false;
  const lower = user.toLowerCase();
  if (SKIP_VALUES.some((s) => lower.includes(s))) return false;
  return true;
};

let transporter = null;

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * @returns {{ ok: boolean, error?: string, skipped?: boolean }}
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!isEmailConfigured()) {
    return { ok: false, skipped: true, error: 'Email is not configured in server/.env' };
  }

  try {
    const transport = getTransporter();
    await transport.sendMail({
      from: process.env.EMAIL_FROM || `AlumiNet <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { ok: true };
  } catch (err) {
    console.error('Email error:', err.message);
    return { ok: false, error: err.message };
  }
};

module.exports = { sendEmail, isEmailConfigured };
