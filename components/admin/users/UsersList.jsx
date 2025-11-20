'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  HiExclamationCircle,
  HiOfficeBuilding,
  HiOutlineEye,
  HiPencilAlt,
  HiTrash,
  HiExclamation,
} from 'react-icons/hi';
import { toast } from 'sonner';

import UserEditModal from '@/components/admin/users/UserEditModal';
import UserCreateModal from '@/components/admin/users/users-create-modal';
import ActionsButton from '@/components/ui/ActionsButton';
import DataCard from '@/components/ui/datatable/_DataCard';
import GridDataList from '@/components/ui/datatable/GridDataList';
import ListGrid from '@/components/ui/datatable/ListGrid';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { exportToExcel } from '@/utils/export/exportToExcel';
import {
  fetchUsers,
  fetchIncompleteProfiles,
  deleteUser,
} from '@/services/userService';

export default function UserList() {
  const queryClient = useQueryClient();

  // TanStack Query hooks for fetching data
  const {
    data: users = [],
    isLoading: loading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    onError: () => {
      toast.error('Gagal mengambil data user.');
    },
  });

  const { data: incompleteProfiles = [] } = useQuery({
    queryKey: ['incompleteProfiles'],
    queryFn: fetchIncompleteProfiles,
    onError: () => {
      toast.error('Gagal memuat profil tidak lengkap.');
    },
  });

  // Mutation for deleting users
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User dihapus.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteModalOpen(false);
      setUserToDelete(null);
    },
    onError: () => {
      toast.error('Gagal menghapus user.');
    },
  });

  // Local state for UI
  const [viewMode, setViewMode] = useState('table');
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleExport = () => {
    const rows = filtered.slice().map((u) => ({
      Nama: u.name,
      Email: u.email,
      Role: u.role,
      Instansi: u.opd?.name || '-',
    }));
    exportToExcel({
      data: rows,
      columns: [
        { header: 'Nama', key: 'Nama' },
        { header: 'Email', key: 'Email' },
        { header: 'Role', key: 'Role' },
        { header: 'Instansi', key: 'Instansi' },
      ],
      filename: 'data_users',
    });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete.id);
  };

  // filters & search
  // filter + search
  const filtered = users.filter((u) => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const text = [u.name, u.email, u.role, u.opd?.name].join(' ').toLowerCase();
    return matchRole && text.includes(searchQuery.toLowerCase());
  });

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const columns = [
    {
      header: 'Nama',
      accessor: 'name',
      width: 'w-1/3',
      cell: (user) => {
        const isIncomplete = incompleteProfiles.includes(user.id);
        return (
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>

            {user.role === 'OPD' && user.opd?.name && (
              <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                <HiOfficeBuilding className="inline h-4 w-4" />
                {user.opd.name}
              </span>
            )}

            {isIncomplete && (
              <span className="text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
                <HiExclamationCircle className="inline h-4 w-4" />
                Profil instansi OPD belum lengkap
              </span>
            )}
          </div>
        );
      },
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Instansi', accessor: 'opd.name' },
  ];

  const actionButtons = [
    (u) => (
      <ActionsButton
        key="view"
        icon={HiOutlineEye}
        tooltip="Detail"
        color="gray"
        onClick={() => (window.location.href = `/adm/users/${u.id}`)}
      />
    ),
    (u) => (
      <ActionsButton
        key="edit"
        icon={HiPencilAlt}
        tooltip="Edit"
        color="blue"
        onClick={() => {
          setSelectedUser(u);
          setOpenEdit(true);
        }}
      />
    ),
    (u) => (
      <ActionsButton
        key="del"
        icon={HiTrash}
        tooltip="Hapus"
        color="red"
        onClick={() => handleDeleteClick(u)}
      />
    ),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-full mx-auto space-y-6"
    >
      <ListGrid
        // header
        title="Manajemen Users"
        showBackButton={false}
        searchBar={true}
        showSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        onExportExcel={handleExport}
        showRefreshButton
        onRefreshClick={refetchUsers}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filtersComponent={
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                className="w-full p-2 border rounded"
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">Semua Role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="OPD">OPD</option>
                <option value="PELAPOR">PELAPOR</option>
                <option value="BUPATI">BUPATI</option>
              </select>
            </div>
            <Button
              color="gray"
              className="w-full"
              onClick={() => {
                setFilterRole('ALL');
                setSearchQuery('');
              }}
            >
              Reset Filter
            </Button>
          </div>
        }
        showCreateButton
        createButtonLabel="Tambah User"
        onCreate={() => setOpenCreate(true)}
        // data
        data={paginated}
        columns={columns}
        actionButtons={actionButtons}
        loading={loading}
        emptyMessage="Tidak ada user ditemukan."
        emptyAction={
          <Button
            color="gray"
            onClick={() => {
              setFilterRole('ALL');
              setSearchQuery('');
              setCurrentPage(1);
            }}
          >
            Reset Filter
          </Button>
        }
        // pagination
        paginationProps={{
          totalItems: filtered.length,
          currentPage,
          pageSize,
          onPageChange: setCurrentPage,
        }}
      />

      <UserCreateModal
        open={openCreate}
        setOpen={setOpenCreate}
        onSuccess={() => {
          setOpenCreate(false);
          refetchUsers();
        }}
      />

      {selectedUser && (
        <UserEditModal
          open={openEdit}
          setOpen={setOpenEdit}
          user={selectedUser}
          onSuccess={() => {
            setOpenEdit(false);
            refetchUsers();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Hapus User?"
        message={
          <>
            Apakah Anda yakin ingin menghapus user{' '}
            <span className="font-bold">{userToDelete?.name}</span>?
          </>
        }
        confirmText="Ya, Hapus User"
        cancelText="Batal"
        confirmColor="red"
        isLoading={deleteUserMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        icon={HiExclamation}
      />
    </motion.div>
  );
}
