import ProfileManagement from '@/features/profile';
import PageHeader from '@/components/ui/PageHeader';

export const metadata = {
  title: 'Profile Management | Lapor Kaka Bupati',
  description:
    'Manage your profile settings and information on Lapor Kaka Bupati.',
};

export default function ProfileManagementPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto p-6  mt-10">
        <PageHeader
          backHref="/adm/dashboard"
          breadcrumbsProps={{
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
