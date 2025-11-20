'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/services/authService';
import CreatePengaduanForm from '@/features/pengaduan/pelapor/create';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';

export default function CreatePengaduanPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <LoadingScreen message="Memuat data pengguna..." />;
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/pelapor/riwayat-pengaduan');
    }, 1000);
  };

  return <CreatePengaduanForm user={user} onSuccess={handleSuccess} />;
}
