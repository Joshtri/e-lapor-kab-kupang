'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Spinner, Badge, Card, Table, Tooltip } from 'flowbite-react';
import {
  HiOfficeBuilding,
  HiArrowLeft,
  HiClock,
  HiCheckCircle,
  HiInformationCircle,
} from 'react-icons/hi';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import CustomBadge from '@/components/ui/custom-badge';

dayjs.locale('id');

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/users/${id}`);
      const { user, reports } = res.data;
      setUser(user);
      setReports(reports || []);
    } catch (error) {
      // ('Gagal ambil detail user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {user.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>

        {/* ⬇️ TAMBAHKAN INI */}
        {user.nikMasked && (
          <p className="text-sm text-gray-500">
            NIK: <span className="font-mono">{user.nikMasked}</span>
          </p>
        )}

        {user.contactNumber && (
          <p className="text-gray-500 text-sm">Kontak: {user.contactNumber}</p>
        )}

        <p className="text-xs text-gray-400 mt-2">
          Dibuat: {dayjs(user.createdAt).format('DD MMM YYYY HH:mm')}
        </p>
        <p className="text-xs text-gray-400">
          Update terakhir: {dayjs(user.updatedAt).format('DD MMM YYYY HH:mm')}
        </p>

        <p className="text-sm">
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
        </p>

        {user.role === 'OPD' && user.opd?.name && (
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <HiOfficeBuilding className="h-4 w-4" />
            {user.opd.name}
          </p>
        )}
      </Card>

      {/* Tabel Laporan */}
      {reports.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">Daftar Laporan</h2>
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
          <span>Belum ada laporan yang dikirim oleh user ini.</span>
        </div>
      )}
    </div>
  );
}
