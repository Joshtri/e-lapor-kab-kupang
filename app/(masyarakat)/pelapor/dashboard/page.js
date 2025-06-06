'use client';

import DashboardPelapor from '@/components/pelapor/DashboardPelapor';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import LoadingMail from '@/components/ui/loading/LoadingMail';
import DashboardPelaporGrid from '@/views/dashboard/DashboardPelaporPage';

export default function DashboardPelaporPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
        if (!res.data.user) {
          router.push('/auth/login');
        }
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return  (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <LoadingMail />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Tidak ada data user, silakan login ulang.
      </div>
    );
  }

  return <DashboardPelaporGrid user={user} />;
}
