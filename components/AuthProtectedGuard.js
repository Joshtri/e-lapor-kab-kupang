'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Spinner } from 'flowbite-react';

export default function AuthProtectGuard({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        const user = res.data?.user;

        if (user) {
          setAuthorized(true);
        } else {
          router.replace('/');
        }
      } catch (error) {
        router.replace('/');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Jangan render apa-apa sebelum pengecekan selesai
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Spinner size="lg" />
        <span className="ml-2">Memeriksa autentikasi...</span>
      </div>
    );
  }

  // Setelah pengecekan selesai, hanya render children jika authorized
  if (!authorized) return null;

  return children;
}
