// File: lib/email/sendResetPasswordEmail.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

export async function sendResetPasswordEmail({ name, email, resetLink }) {
  const mailOptions = {
    from: `"Lapor KK Bupati" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Password',
    html: `
      <p>Halo <strong>${name}</strong>,</p>
      <p>Klik link berikut untuk mereset password Anda:</p>
      <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
      <p><em>Link ini hanya berlaku selama 1 jam.</em></p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
