import EditPelaporForm from '@/features/kelola-pengguna/pelapor/edit';

export default function EditPelaporPage({ params }) {
  return <EditPelaporForm userId={params.id} />;
}
