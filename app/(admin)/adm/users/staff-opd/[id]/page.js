import StaffOpdDetail from '@/features/kelola-pengguna/staff-opd/detail';

export default function StaffOpdDetailPage({ params }) {
  return <StaffOpdDetail userId={params.id} />;
}
