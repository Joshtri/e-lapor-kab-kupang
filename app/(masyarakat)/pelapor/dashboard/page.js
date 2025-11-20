'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import { fetchCurrentUser } from '@/services/authService';
import DashboardPelaporGrid from '@/features/dashboard/masyarakat';

export default function DashboardPelaporPage() {
  const router = useRouter();

  // Fetch current user using TanStack Query
  const {
    data: user = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    onError: () => {
      toast.error('Gagal mengambil data user. Silakan login ulang.');
      router.push('/auth/login');
    },
    retry: false,
  });

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Tidak ada data user, silakan login ulang.
      </div>
    );
  }

  return <DashboardPelaporGrid user={user} />;
}
