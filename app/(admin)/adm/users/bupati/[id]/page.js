import BupatiDetail from '@/features/kelola-pengguna/bupati/detail';

export default function BupatiDetailPage({ params }) {
  return <BupatiDetail userId={params.id} />;
}
