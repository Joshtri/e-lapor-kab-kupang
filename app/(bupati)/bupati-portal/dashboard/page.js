import { AdminDashboard as BupatiDashboard } from '@/features/dashboard/admin';

export const metadata = {
  title: 'Dashboard Bupati',
  description: 'Halaman dashboard utama untuk Bupati.',
};

export default function DashboardBupatiPage() {
  return <BupatiDashboard titleHeader="Dashboard Bupati" />;
}
