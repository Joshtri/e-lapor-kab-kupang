import PengaduanJurnalList from '@/features/jurnal-pengaduan/list';

export const metadata = {
  title: 'Jurnal Laporan Pengaduan | E-Lapor Kabupaten Kupang',
  description:
    'Manajemen dan ekspor data jurnal laporan pengaduan masyarakat berdasarkan periode waktu di platform E-Lapor Kabupaten Kupang',
  keywords: 'Laporan Jurnal, jurnal, laporan, admin',
};

export default function JournalReportPage() {
  return <PengaduanJurnalList />;
}
