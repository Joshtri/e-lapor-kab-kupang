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
  const mailOptions = {
    from: `"Lapor KK Bupati" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Status Laporan Anda Telah Diperbarui',
    html: `
      <p>Halo ${name},</p>
      <p>Status laporan Anda yang berjudul <strong>${title}</strong> telah diperbarui menjadi <strong>${status}</strong>.</p>
      <p>Silakan cek aplikasi untuk melihat detailnya.</p>
      <p>Terima kasih.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
