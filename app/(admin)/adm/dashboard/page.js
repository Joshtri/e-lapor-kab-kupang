import AdminDashboard from '@/components/admin/DashboardAdmin';

export const metadata = {
  title: 'Dashboard Admin',
  description: 'Halaman dashboard utama untuk administrator sistem.',
};


export default function DashboardAdminPage() {
  return <AdminDashboard titleHeader="Dashboard Admin" />;
}
