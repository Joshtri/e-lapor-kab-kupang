import ReportJournal from '@/views/admin/journal/JournalReportPage';
import React from 'react';

export const metadata = {
  title: 'Jurnal Laporan Pengaduan | E-Lapor Kabupaten Kupang',
  description:
    'Manajemen dan ekspor data jurnal laporan pengaduan masyarakat berdasarkan periode waktu di platform E-Lapor Kabupaten Kupang',
  keywords: 'Laporan Jurnal, jurnal, laporan, admin',
  openGraph: {
    title: 'Laporan Jurnal',
    description: 'Laporan Jurnal',
    url: '/admin/journal/report',
    siteName: 'SIAKAD',
  },
  twitter: {
    title: 'Laporan Jurnal',
    description: 'Laporan Jurnal',
  },
};

export default function JournalReportPage() {
  return <ReportJournal />;
}
