'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from 'flowbite-react';
import { HiOutlineArrowLeft, HiOutlineMail, HiOutlinePhone, HiOutlineGlobe, HiOutlineSearch } from 'react-icons/hi';
import { toast } from 'sonner';

import { fetchOpdDetailV2 } from '@/services/opdServiceV2';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';

export default function OpdDetail({ opdId }) {
  const router = useRouter();
  const [searchStaff, setSearchStaff] = useState('');

  const {
    data: opd,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['opd-v2', opdId],
    queryFn: () => fetchOpdDetailV2(opdId),
    onError: () => {
      toast.error('Gagal memuat detail OPD');
    },
  });

  // Filter staff berdasarkan search
  const filteredStaff = useMemo(() => {
    if (!opd?.staff) return [];
    return opd.staff.filter((person) => {
      const searchLower = searchStaff.toLowerCase();
      return (
        person.name.toLowerCase().includes(searchLower) ||
        person.email.toLowerCase().includes(searchLower) ||
        (person.contactNumber && person.contactNumber.includes(searchStaff))
      );
    });
  }, [opd?.staff, searchStaff]);

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (error || !opd) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <HiOutlineArrowLeft className="h-5 w-5" />
          <span>Kembali</span>
        </button>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">OPD tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <HiOutlineArrowLeft className="h-5 w-5" />
          <span>Kembali</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {opd.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Detail Organisasi Perangkat Daerah
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Detail Info */}
        <div>
          {/* Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Informasi OPD
            </h2>

            <div className="space-y-6">
              {/* Alamat */}
              {opd.alamat && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Alamat
                  </p>
                  <p className="text-gray-900 dark:text-white">{opd.alamat}</p>
                </div>
              )}

              {/* Email */}
              {opd.email && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Email Instansi
                  </p>
                  <a
                    href={`mailto:${opd.email}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <HiOutlineMail className="h-5 w-5" />
                    {opd.email}
                  </a>
                </div>
              )}

              {/* Telepon */}
              {opd.telp && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Nomor Telepon Instansi
                  </p>
                  <a
                    href={`tel:${opd.telp}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <HiOutlinePhone className="h-5 w-5" />
                    {opd.telp}
                  </a>
                </div>
              )}

              {/* Website */}
              {opd.website && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Website
                  </p>
                  <a
                    href={opd.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <HiOutlineGlobe className="h-5 w-5" />
                    {opd.website}
                  </a>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dibuat:{' '}
                  {new Date(opd.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Diperbarui:{' '}
                  {new Date(opd.updatedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Staff Instansi
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: {opd.staff?.length ?? 0} staff
                </p>
              </div>

              {/* Search Bar */}
              {opd.staff && opd.staff.length > 0 && (
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari staff berdasarkan nama, email, atau nomor telepon..."
                    value={searchStaff}
                    onChange={(e) => setSearchStaff(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Staff Table */}
            {opd.staff && opd.staff.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Nama
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Nomor Telepon
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((person) => (
                        <tr
                          key={person.id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {person.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            <a
                              href={`mailto:${person.email}`}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {person.email}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {person.contactNumber ? (
                              <a
                                href={`tel:${person.contactNumber}`}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                {person.contactNumber}
                              </a>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                              {person.role}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400"
                        >
                          Tidak ada staff yang sesuai dengan pencarian
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <p className="text-sm">Belum ada staff terdaftar untuk OPD ini</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          color="blue"
          onClick={() =>
            router.push(`/adm/organisasi-perangkat-daerah/${opd.id}/edit`)
          }
        >
          Edit OPD
        </Button>
        <Button color="light" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
    </div>
  );
}
