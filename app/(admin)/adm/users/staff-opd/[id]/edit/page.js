import EditStaffOpdForm from '@/features/kelola-pengguna/staff-opd/edit';

export default function EditStaffOpdPage({ params }) {
  return <EditStaffOpdForm userId={params.id} />;
}
