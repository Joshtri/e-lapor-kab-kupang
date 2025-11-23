import OpdEdit from '@/features/kelola-organisasi-perangkat-daerah-v2/edit/OpdEdit';
import React from 'react';

export default function EditOrganisasiPerangkatDaerahPage({ params }) {
  return <OpdEdit opdId={params.id} />;
}
