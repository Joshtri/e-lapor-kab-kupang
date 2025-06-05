import ProfileManagement from '@/components/profile';
import PageHeader from '@/components/ui/PageHeader';

export default function ProfileManagementPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto p-6  mt-10">
        <PageHeader
          title={'Profil Saya'}
          backHref="/pelapor/dashboard"
          breadcrumbsProps={{
            home: { label: 'Beranda', href: '/pelapor/dashboard' },
            customRoutes: {
              pelapor: {
                label: 'Dashboard pelapor',
                href: '/pelapor/dashboard',
              },
            },
          }}
        />
      </div>
      <ProfileManagement />
    </>
  );
}
