import EditAdminForm from '@/features/kelola-pengguna/admin/edit';

export default function EditAdminPage({ params }) {
  return <EditAdminForm userId={params.id} />;
}
