// app/pelapor/statistik/page.jsx
import StatistikPelaporPage from '@/views/pelapor/StatistikPelaporPage';

export const metadata = {
  title: 'Statistik Pelapor | Lapor Kaka Bupati',
  description: 'Halaman statistik untuk pelapor',
};

export default function StatistikPage() {
  return <StatistikPelaporPage />; // ✅ tanpa prop user
}
