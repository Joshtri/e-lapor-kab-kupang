'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, Button, Badge, Spinner } from 'flowbite-react';
import { HiPencil, HiArrowLeft, HiMail, HiPhone, HiIdentification, HiCalendar } from 'react-icons/hi';
import axios from 'axios';
import PageHeader from '@/components/ui/PageHeader';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';

const fetchUserDetail = async (id) => {
  const { data } = await axios.get(`/api/users/${id}`);
  return data;
};

export default function BupatiDetail({ userId }) {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserDetail(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return <LoadingScreen isLoading={true} message="Memuat detail bupati..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Gagal memuat detail bupati
          </p>
        </div>
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <PageHeader
          title="Detail Akun Bupati"
          description="Informasi lengkap akun bupati"
          backHref="/adm/users/bupati"
          role="adm"
        />
      </div>

      <Card>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.name}
              </h2>
              <Badge color="success" className="mt-2">
                BUPATI
              </Badge>
            </div>
          </div>

          <Button
            color="blue"
            onClick={() => router.push(`/adm/users/bupati/${userId}/edit`)}
          >
            <HiPencil className="mr-2 h-5 w-5" />
            Edit
          </Button>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="flex items-start gap-3">
            <HiMail className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Kontak */}
          <div className="flex items-start gap-3">
            <HiPhone className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No. Kontak</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {user?.contactNumber || '-'}
              </p>
            </div>
          </div>

          {/* NIK */}
          <div className="flex items-start gap-3">
            <HiIdentification className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">NIK</p>
              <p className="text-base font-medium text-gray-900 dark:text-white font-mono">
                {user?.nikMasked || '-'}
              </p>
            </div>
          </div>

          {/* Tanggal Daftar */}
          <div className="flex items-start gap-3">
            <HiCalendar className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Daftar</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {new Date(user?.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        {data?.reports && data.reports.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Statistik Pengaduan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Pengaduan</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {data.reports.length}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-green-600 dark:text-green-400">Selesai</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {data.reports.filter(r => r.bupatiStatus === 'SELESAI').length}
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Dalam Proses</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {data.reports.filter(r => r.bupatiStatus === 'PROSES').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button color="light" onClick={() => router.push('/adm/users/bupati')}>
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Kembali
          </Button>
        </div>
      </Card>
    </div>
  );
}
