import NotificationEmail from '@/components/common/NotificationEmail';
import { transporter } from './transporter';
import { render } from '@react-email/components';

export async function sendCommentEmailNotify({
  to,
  name,
  reportTitle,
  commentText,
}) {
  try {
    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Invalid email address: ${to}`);
    }

    const emailHtml = await render(
      NotificationEmail({
        previewText: `Komentar Baru: ${reportTitle}`,
        greeting: `Halo ${name},`,
        intro: `Ada komentar baru pada laporan Anda dengan judul "${reportTitle}".`,
        details: [{ label: 'Komentar', value: commentText }],
        ctaLabel: 'Lihat Detail Laporan',
        ctaLink: `${process.env.APP_URL}/pelapor/log-laporan`, // Adjust URL as needed
        closing: 'Terima kasih,\nTim Sistem Lapor KK Bupati\nPemerintah Daerah',
      }),
    );

    const mailOptions = {
      from: `"Lapor KK Bupati" <${process.env.EMAIL_USER}>`,
      to,
      subject: `📬 Komentar Baru pada Laporan: ${reportTitle}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send comment notification email to ${to}:`, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
