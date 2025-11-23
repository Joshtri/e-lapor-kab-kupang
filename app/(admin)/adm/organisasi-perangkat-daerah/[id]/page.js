import OpdDetail from '@/features/kelola-organisasi-perangkat-daerah-v2/detail/OpdDetail'
import React from 'react'

export default function DetailOrganisasiPerangkatDaerahPage({ params }) {
  return (
    <OpdDetail opdId={params.id} />
  )
}
