import AuthProtectGuard from '@/components/AuthProtectedGuard';
import FooterPelapor from '@/components/pelapor/partials/footer';
import HeaderPelapor from '@/components/pelapor/partials/header';
import ClientThemeProvider from '@/providers/client-theme-provider';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function PelaporLayout({ children }) {
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  try {
    verify(token, process.env.JWT_SECRET);
  } catch (error) {
    redirect('/auth/login');
  }

  return (
    <AuthProtectGuard allowRole={['PELAPOR']}>
      <ClientThemeProvider>
        <div className="flex flex-col min-h-screen bg-blue-50  dark:bg-gray-900">
          <HeaderPelapor />
          <main className="flex-grow pt-14">{children}</main>
          <FooterPelapor />
        </div>
      </ClientThemeProvider>
    </AuthProtectGuard>
  );
}
