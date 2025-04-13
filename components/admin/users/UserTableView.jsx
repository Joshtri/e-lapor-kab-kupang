'use client';

import { useState } from 'react';
import { Table, Badge, Button, Tooltip } from 'flowbite-react';
import Link from 'next/link';
import {
  HiEye,
  HiPencil,
  HiTrash,
  HiExclamationCircle,
  HiOfficeBuilding,
} from 'react-icons/hi';
import UserEditModal from './UserEditModal';
import axios from 'axios';
import { toast } from 'sonner';
import Pagination from '@/components/ui/Pagination'; // pastikan ini ada

export default function UserTable({
  users,
  incompleteProfiles = [],
  onSuccess,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleDelete = async (userId) => {
    const confirm = window.confirm(
      'Apakah Anda yakin ingin menghapus user ini?',
    );
    if (!confirm) return;

    try {
      setLoadingId(userId);
      await axios.delete(`/api/users/${userId}`);
      toast.success('User berhasil dihapus');
      onSuccess?.(); // reload data
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Gagal menghapus user');
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Pagination Logic
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
        <Table
          hoverable
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        >
          <Table.Head className="bg-gray-50 dark:bg-gray-800">
            <Table.HeadCell>Nama</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Aksi</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedUsers.map((user) => {
              const isOPDWithoutProfile =
                user.role === 'OPD' && incompleteProfiles.includes(user.id);

              return (
                <Table.Row
                  key={user.id}
                  className={`transition-colors duration-150 ${
                    isOPDWithoutProfile
                      ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Table.Cell className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      {user.role === 'OPD' && user.opd?.name && (
                        <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                          <HiOfficeBuilding className="inline h-4 w-4" />
                          {user.opd.name}
                        </span>
                      )}
                      {isOPDWithoutProfile && (
                        <span className="text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
                          <HiExclamationCircle className="inline h-4 w-4" />
                          Profil instansi OPD belum lengkap
                        </span>
                      )}
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-sm text-gray-700 dark:text-gray-300">
                    {user.email}
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      color={
                        user.role === 'ADMIN'
                          ? 'purple'
                          : user.role === 'BUPATI'
                            ? 'green'
                            : user.role === 'OPD'
                              ? 'indigo'
                              : 'blue'
                      }
                    >
                      {user.role}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell className="text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <Link href={`/adm/users/${user.id}`}>
                        <Tooltip content="Lihat Detail">
                          <Button color="gray" size="xs" className="p-1.5">
                            <HiEye className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                      </Link>
                      <Tooltip content="Edit">
                        <Button
                          color="blue"
                          size="xs"
                          className="p-1.5"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenEdit(true);
                          }}
                        >
                          <HiPencil className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Hapus">
                        <Button
                          color="red"
                          size="xs"
                          className="p-1.5"
                          onClick={() => handleDelete(user.id)}
                          disabled={loadingId === user.id}
                        >
                          <HiTrash className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      {/* ✅ Pagination */}
      <Pagination
        totalItems={users.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* ✅ Edit Modal */}
      <UserEditModal
        open={openEdit}
        setOpen={setOpenEdit}
        user={selectedUser}
        onSuccess={onSuccess}
      />
    </div>
  );
}
