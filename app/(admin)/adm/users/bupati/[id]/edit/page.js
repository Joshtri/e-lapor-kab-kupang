import EditBupatiForm from '@/features/kelola-pengguna/bupati/edit';

export default function EditBupatiPage({ params }) {
  return <EditBupatiForm userId={params.id} />;
}
