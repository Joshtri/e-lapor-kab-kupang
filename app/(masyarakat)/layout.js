import AuthProtectGuard from '@/components/AuthProtectedGuard';
import ResponsiveLayout from '@/components/pelapor/ResponsiveLayout';
import ClientThemeProvider from '@/providers/client-theme-provider';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PropTypes from 'prop-types';
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
        <ResponsiveLayout>{children}</ResponsiveLayout>
      </ClientThemeProvider>
    </AuthProtectGuard>
  );
}


PelaporLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

