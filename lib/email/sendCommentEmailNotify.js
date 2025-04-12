import { transporter } from './transporter';

export async function sendCommentEmailNotify({ to, name, reportTitle, commentText }) {
  const mailOptions = {
    from: `"Lapor KK Bupati" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Komentar Baru pada Laporan: ${reportTitle}`,
    html: `
      <p>Halo ${name},</p>
      <p>Ada komentar baru pada laporan Anda dengan judul <strong>${reportTitle}</strong>.</p>
      <blockquote style="margin: 10px 0; padding-left: 10px; border-left: 3px solid #ccc;">
        ${commentText}
      </blockquote>
      <p>Silakan buka aplikasi untuk melihat detailnya.</p>
      <p>Terima kasih.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
