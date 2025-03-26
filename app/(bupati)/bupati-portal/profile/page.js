import ProfileManagement from '@/components/profile';
import PageHeader from '@/components/ui/page-header';
import React from 'react';

export default function ProfileManagementPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto p-6  mt-10">
        <PageHeader
          title={'Profil Saya'}
          backHref="/bupati-portal/dashboard"
          breadcrumbsProps={{
            home: { label: 'Beranda', href: '/bupati-portal/dashboard' },
            customRoutes: {
              'bupati-portal': {
                label: 'Dashboard bupati-portal',
                href: '/bupati-portal/dashboard',
              },
            },
          }}
        />
      </div>
      <ProfileManagement />
    </>
  );
}
