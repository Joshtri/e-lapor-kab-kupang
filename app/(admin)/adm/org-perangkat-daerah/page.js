import KelolaOrganisasiList from '@/features/kelola-organisasi-perangkat-daerah/list';

export const metadata = {
  title: 'Data OPD | Lapor Kaka Bupati',
  description: 'Daftar Organisasi Perangkat Daerah pada Lapor Kaka Bupati.',
};
export default function OpdListPage() {
  return <KelolaOrganisasiList />;
}
