import { transporter } from './transporter';

export const sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: `"LAPOR KK BUPATI SERVICES" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Selamat Datang di Layanan Pengaduan Lapor KK Bupati!',
    html: `
        <h2>Halo ${name},</h2>
        <p>Selamat datang di platform layanan pengaduan kami. Akun Anda berhasil didaftarkan.</p>
        <p>Silakan login untuk mulai menggunakan layanan.</p>
        <br/>
        <p>Salam hangat,</p>
        <p><b>Tim Admin</b></p>
      `,
  });
};
