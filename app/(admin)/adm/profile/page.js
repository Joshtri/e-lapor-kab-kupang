import ProfileManagement from '@/components/profile';
import PageHeader from '@/components/ui/page-header';

export default function ProfileManagementPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto p-6  mt-10">
        <PageHeader
           backHref="/adm/dashboard"
          breadcrumbsProps={{
            home: { label: 'Beranda', href: '/adm/dashboard' },
            customRoutes: {
              adm: {
                label: 'Dashboard Admin',
                href: '/adm/dashboard',
              },
            },
          }}
        />
      </div>
      <ProfileManagement />
    </>
  );
}
