import ProfileManagement from '@/features/profile';
import PageHeader from '@/components/ui/PageHeader';

export default function ProfileManagementPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto p-6  mt-10">
        <PageHeader
          backHref="/opd/dashboard"
          breadcrumbsProps={{
            home: { label: 'Beranda', href: '/opd/dashboard' },
            customRoutes: {
              opd: {
                label: 'Dashboard OPD',
                href: '/opd/dashboard',
              },
            },
          }}
        />
      </div>
      <ProfileManagement />
    </>
  );
}
