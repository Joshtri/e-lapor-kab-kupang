'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import LoadingMail from './ui/loading/LoadingMail';

export default function AuthProtectGuard({ children, allowRole = [] }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        const user = res.data?.user;

        if (user && allowRole.includes(user.role)) {
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
  }, [router, allowRole]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        {/* <Spinner size="lg" /> */}
        <LoadingMail label={'Memeriksa autentikasi...'}/>
       </div>
    );
  }

  if (!authorized) return null;

  return children;
}
