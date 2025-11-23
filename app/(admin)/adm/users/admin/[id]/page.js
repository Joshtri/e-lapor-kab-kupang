import AdminDetail from '@/features/kelola-pengguna/admin/detail';

export default function AdminDetailPage({ params }) {
  return <AdminDetail userId={params.id} />;
}
