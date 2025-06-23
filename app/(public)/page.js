import HomePublic from '@/components/home/homePublic';
export const metadata = {
  title: 'Lapor Kaka Bupati | Kabupaten Kupang',
  description:
    'Sampaikan aspirasi, keluhan, dan laporan Anda langsung kepada Bupati Kabupaten Kupang melalui layanan Lapor Kaka Bupati. Cepat, mudah, dan transparan.',
  keywords: [
    'lapor bupati',
    'kabupaten kupang',
    'pengaduan masyarakat',
    'aspirasi warga',
    'pelayanan publik',
    'laporan KK Bupati',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Lapor Kaka Bupati | Kabupaten Kupang',
    description:
      'Layanan resmi untuk warga Kabupaten Kupang menyampaikan laporan, aspirasi, dan keluhan langsung kepada Bupati. Kami dengarkan, kami tanggapi.',
    url: 'https://yourdomain.com',
    siteName: 'Lapor Kaka Bupati',
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: 'https://yourdomain.com/images/og-lapor-kk.jpg',
        width: 1200,
        height: 630,
        alt: 'Lapor Kaka Bupati - Kabupaten Kupang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lapor Kaka Bupati | Kabupaten Kupang',
    description:
      'Sampaikan laporan Anda secara langsung dan mudah kepada Bupati Kabupaten Kupang. Layanan publik berbasis transparansi dan partisipasi warga.',
    site: '@pemkabbkupang',
    images: ['https://yourdomain.com/images/og-lapor-kk.jpg'],
  },
  category: 'Pelayanan Publik',
  authors: [
    { name: 'Pemerintah Kabupaten Kupang', url: 'https://yourdomain.com' },
  ],
};

export default function Home() {
  return <HomePublic />;
}
