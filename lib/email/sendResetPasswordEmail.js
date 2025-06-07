import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import NotificationEmail from '@/components/common/NotificationEmail'; // pastikan path ini sesuai

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
  const emailHtml = await render(
    NotificationEmail({
      previewText: 'Reset Password Anda',
      greeting: `Halo ${name || 'Pengguna'},`,
      intro: 'Anda menerima permintaan untuk mereset password akun Anda.',
      details: [],
      ctaLabel: 'Reset Password Sekarang',
      ctaLink: resetLink,
      closing:
        'Link ini hanya berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.',
    }),
  );

  await transporter.sendMail({
    from: `"Lapor KK Bupati" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Reset Password Akun Anda',
    html: emailHtml,
  });
}
