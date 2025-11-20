import NotificationEmail from '@/components/common/NotificationEmail';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendStatusUpdateEmail({ to, name, title, status }) {
  const emailHtml = await render(
    NotificationEmail({
      previewText: `Status Pengaduan: ${title}`,
      greeting: `Halo ${name},`,
      intro: `Status pengaduan Anda yang berjudul "${title}" telah diperbarui.`,
      details: [
        { label: 'Judul Pengaduan', value: title },
        { label: 'Status Terbaru', value: status },
      ],
      ctaLabel: 'Lihat Detail Pengaduan',
      ctaLink: `${process.env.APP_URL}/pelapor/riwayat-pengaduan`, // Adjust URL as needed
      closing: 'Terima kasih,\nTim Sistem Lapor Kaka Bupati\nPemerintah Daerah',
    }),
  );

  const mailOptions = {
    from: `"Lapor Kaka Bupati" <${process.env.EMAIL_USER}>`,
    to,
    subject: '📬 Status Pengaduan Anda Telah Diperbarui',
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}
