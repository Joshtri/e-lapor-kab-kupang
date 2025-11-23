import AdminList from '@/features/kelola-pengguna/admin/list';

export const metadata = {
  title: 'Kelola Akun Admin',
  description: 'Manajemen akun administrator sistem e-Lapor',
};

export default function AdminPage() {
  return <AdminList />;
}
