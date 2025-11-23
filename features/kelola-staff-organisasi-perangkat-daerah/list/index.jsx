'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import { HiOutlineSearch, HiOutlineMail, HiOutlinePhone, HiPlus } from 'react-icons/hi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { fetchUsersByRole } from '@/services/userService';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';

export default function StaffOpdList() {
  const router = useRouter();
  const [searchStaff, setSearchStaff] = useState('');

  const {
    data: staffList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['staff-opd'],
    queryFn: () => fetchUsersByRole('OPD'),
    onError: () => {
      toast.error('Gagal memuat data staff OPD');
    },
  });

  // Filter staff berdasarkan search
  const filteredStaff = useMemo(() => {
    if (!staffList) return [];
    return staffList.filter((person) => {
      const searchLower = searchStaff.toLowerCase();
      return (
        person.name.toLowerCase().includes(searchLower) ||
        person.email.toLowerCase().includes(searchLower) ||
        (person.contactNumber && person.contactNumber.includes(searchStaff)) ||
        (person.opd?.name && person.opd.name.toLowerCase().includes(searchLower))
      );
    });
  }, [staffList, searchStaff]);

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Gagal memuat data staff OPD
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manajemen Staff OPD
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Daftar pengguna dengan role Staff OPD yang terdaftar di sistem
          </p>
        </div>
        <Button
          color="blue"
          onClick={() => router.push('/adm/staff-organisasi-perangkat-daerah/create')}
        >
          <HiPlus className="mr-2 h-5 w-5" />
          Tambah Staff OPD
        </Button>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Stats */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Staff OPD: <span className="font-semibold text-gray-900 dark:text-white">{staffList?.length ?? 0}</span>
          </p>
        </div>

        {/* Search Bar */}
        {staffList && staffList.length > 0 && (
          <div className="mb-6 relative">
            <HiOutlineSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari staff berdasarkan nama, email, nomor telepon, atau OPD..."
              value={searchStaff}
              onChange={(e) => setSearchStaff(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Staff Table */}
        {staffList && staffList.length > 0 ? (
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
                    OPD
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Tanggal Daftar
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
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                        {person.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        <a
                          href={`mailto:${person.email}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 w-fit"
                        >
                          <HiOutlineMail className="h-4 w-4" />
                          {person.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {person.contactNumber ? (
                          <a
                            href={`tel:${person.contactNumber}`}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 w-fit"
                          >
                            <HiOutlinePhone className="h-4 w-4" />
                            {person.contactNumber}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {person.opd ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium inline-block">
                            {person.opd.name}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs font-medium inline-block">
                            Belum di-assign
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(person.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
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
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <p className="text-sm">Belum ada staff OPD terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
}
