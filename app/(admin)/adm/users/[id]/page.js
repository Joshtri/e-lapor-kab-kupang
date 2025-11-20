'use client';

import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import CustomBadge from '@/components/ui/CustomBadge';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import { fetchUserDetail } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Card, Table } from 'flowbite-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  HiArrowLeft,
  HiClock,
  HiInformationCircle,
  HiOfficeBuilding,
} from 'react-icons/hi';

dayjs.locale('id');

export default function UserDetailPage() {
  const { id } = useParams();

  const { data, isLoading: loading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserDetail(id),
    enabled: !!id,
  });

  const user = data?.user;
  const reports = data?.reports || [];

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-screen">
      //   <lOA size="lg" />
      // </div>
      <LoadingScreen isLoading={loading} />
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
        <HiArrowLeft className="h-4 w-4" />
        <Link href="/adm/users" className="hover:underline">
          Kembali ke Manajemen Users
        </Link>
      </div>

      {/* Informasi User */}
      <Card className="w-full">
        <Heading className="text-2xl font-bold text-gray-800 dark:text-white">
          {user.name}
        </Heading>
        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>

        {/* ⬇️ TAMBAHKAN INI */}
        {user.nikMasked && (
          <Text className="text-sm text-gray-500">
            NIK: <span className="font-mono">{user.nikMasked}</span>
          </Text>
        )}

        {user.contactNumber && (
          <Text className="text-sm text-gray-500">
            Kontak: {user.contactNumber}
          </Text>
        )}

        <Text className="text-xs text-gray-400 mt-2">
          Dibuat: {dayjs(user.createdAt).format('DD MMM YYYY HH:mm')}
        </Text>
        <Text className="text-xs text-gray-400">
          Update terakhir: {dayjs(user.updatedAt).format('DD MMM YYYY HH:mm')}
        </Text>

        <Text className="text-sm">
          Role:{' '}
          <CustomBadge
            color={
              user.role === 'ADMIN'
                ? 'purple'
                : user.role === 'BUPATI'
                  ? 'green'
                  : user.role === 'OPD'
                    ? 'indigo'
                    : 'blue'
            }
            size="sm"
          >
            {user.role}
          </CustomBadge>
        </Text>

        {user.role === 'OPD' && user.opd?.name && (
          <Text className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <HiOfficeBuilding className="h-4 w-4" />
            {user.opd.name}
          </Text>
        )}
      </Card>

      {/* Tabel Laporan */}
      {reports.length > 0 ? (
        <div>
          <Heading className="text-lg font-semibold mb-2">
            Daftar Laporan
          </Heading>
          <div className="overflow-x-auto">
            <Table hoverable striped>
              <Table.Head>
                <Table.HeadCell>Judul</Table.HeadCell>
                <Table.HeadCell>Kategori</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Dibuat</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {reports.map((report) => (
                  <Table.Row key={report.id}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {report.title}
                    </Table.Cell>
                    <Table.Cell>{report.category}</Table.Cell>
                    <Table.Cell>
                      <span className="inline-block text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {report.bupatiStatus}
                      </span>
                    </Table.Cell>

                    <Table.Cell className="flex items-center gap-1 text-sm text-gray-500">
                      <HiClock className="h-4 w-4" />
                      {dayjs(report.createdAt).format('DD MMMM YYYY')}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <HiInformationCircle className="w-5 h-5" />
          <Text>Belum ada laporan yang dikirim oleh user ini.</Text>
        </div>
      )}
    </div>
  );
}
