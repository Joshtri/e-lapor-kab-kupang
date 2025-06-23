import NotificationEmail from '@/components/common/NotificationEmail';
import { transporter } from './transporter';
import { render } from '@react-email/components';

export const sendWelcomeEmail = async (to, name) => {
  const emailHtml = await render(
    NotificationEmail({
      previewText: `Selamat Datang, ${name}!`,
      greeting: `Halo ${name},`,
      intro:
        'Selamat datang di platform layanan pengaduan Lapor Kaka Bupati. Akun Anda telah berhasil didaftarkan.',
      details: [],
      ctaLabel: 'Login Sekarang',
      ctaLink: `${process.env.APP_URL}/login`, // Adjust URL as needed
      closing: 'Salam hangat,\nTim Admin\nSistem Lapor Kaka Bupati',
    }),
  );

  await transporter.sendMail({
    from: `"Lapor Kaka Bupati SERVICES" <${process.env.EMAIL_USER}>`,
    to,
    subject: '📬 Selamat Datang di Layanan Pengaduan Lapor Kaka Bupati!',
    html: emailHtml,
  });
};
