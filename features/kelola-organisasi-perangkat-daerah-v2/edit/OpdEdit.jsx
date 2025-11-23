'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { fetchOpdDetailV2 } from '@/services/opdServiceV2';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import OpdForm from '@/features/kelola-organisasi-perangkat-daerah-v2/form/OpdForm';
import { HiOutlineArrowLeft } from 'react-icons/hi';

export default function OpdEdit({ opdId }) {
  const router = useRouter();

  const {
    data: opd,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['opd-v2', opdId],
    queryFn: () => fetchOpdDetailV2(opdId),
    onError: () => {
      toast.error('Gagal memuat data OPD');
    },
  });

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (error || !opd) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <HiOutlineArrowLeft className="h-5 w-5" />
          <span>Kembali</span>
        </button>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            OPD tidak ditemukan atau terjadi kesalahan saat memuat data
          </p>
        </div>
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData = {
    id: opd.id,
    name: opd.name,
    email: opd.email,
    telp: opd.telp,
    alamat: opd.alamat,
    website: opd.website || '',
  };

  return <OpdForm initialData={initialData} isEdit={true} />;
}
