import { AdminDashboard } from '@/features/dashboard/admin';

export const metadata = {
  title: 'Dashboard Admin',
  description: 'Halaman dashboard utama untuk administrator sistem.',
};


export default function DashboardAdminPage() {
  return <AdminDashboard titleHeader="Dashboard Admin" />;
}
