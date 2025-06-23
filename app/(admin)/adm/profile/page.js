import ProfileManagement from '@/components/profile';
import PageHeader from '@/components/ui/PageHeader';

export const metadata = {
  title: 'Profile Management | Lapor Kaka Bupati',
  description:
    'Manage your profile settings and information on Lapor Kaka Bupati.',
  keywords: 'profile, management, settings, Lapor Kaka Bupati',
  openGraph: {
    title: 'Profile Management | Lapor Kaka Bupati',
    description:
      'Manage your profile settings and information on Lapor Kaka Bupati.',
    url: '/adm/dashboard/profile',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Profile Management | Lapor Kaka Bupati',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile Management | Lapor Kaka Bupati',
    description:
      'Manage your profile settings and information on Lapor Kaka Bupati.',
    site: '@pemkabbkupang',
    images: ['/images/og-image.png'],
  },
  category: 'Profile Management',
  authors: [
    { name: 'Pemerintah Kabupaten Kupang', url: 'https://yourdomain.com' },
  ],
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
