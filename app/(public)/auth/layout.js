'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('auth_token');
    if (token) {
      router.replace('/'); // Atau /pelapor/dashboard, /admin, dll
    }
  }, []);

  return <>{children}</>;
}
