import PelaporDetail from '@/features/kelola-pengguna/pelapor/detail';

export default function PelaporDetailPage({ params }) {
  return <PelaporDetail userId={params.id} />;
}
