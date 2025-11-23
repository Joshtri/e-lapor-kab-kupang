'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import ListGrid, {
  ActionButtonsPresets,
} from '@/components/ui/datatable/ListGrid';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import {
  deleteUser,
  fetchIncompleteProfiles,
  fetchUsers,
} from '@/services/userService';
import { exportToExcel } from '@/utils/export/exportToExcel';
import { useRouter } from 'next/navigation';
import { getColumns } from './columns';

// Kelola Pengguna List Component
export default function KelolaPenggunaList() {
  const queryClient = useQueryClient();
  const router = useRouter();

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
      toast.success('User berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('Gagal menghapus user.');
    },
  });

  // Local state for UI
  const [viewMode, setViewMode] = useState('table');
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter and search
  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const text = [u.name, u.email, u.role, u.opd?.name].join(' ').toLowerCase();
    return matchRole && text.includes(searchQuery.toLowerCase());
  });

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredUsers.map((u) => ({
      Nama: u.name,
      Email: u.email,
      Role: u.role,
      Instansi: u.opd?.name || '-',
    }));

    exportToExcel({
      data: exportData,
      columns: [
        { header: 'Nama', key: 'Nama' },
        { header: 'Email', key: 'Email' },
        { header: 'Role', key: 'Role' },
        { header: 'Instansi', key: 'Instansi' },
      ],
      filename: 'data_users',
    });
  };

  // Delete handler - open confirmation modal
  const handleDelete = (user) => {
    setItemToDelete(user);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteUserMutation.mutate(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Get columns with incomplete profiles data
  const columns = getColumns(incompleteProfiles);

  return (
    <>
      <LoadingScreen isLoading={deleteUserMutation.isPending} />

      <ListGrid
        // Page header props
        title="Manajemen Pengguna"
        role="adm"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        onExportExcel={handleExportExcel}
        showRefreshButton={true}
        onRefreshClick={refetchUsers}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCreateButton={true}
        createButtonLabel="Tambah User"
        onCreate={() => router.push('/adm/users/create')}
        // Filters - auto reset handled by ListGrid
        filters={[
          {
            type: 'select',
            label: 'Role',
            value: filterRole,
            onChange: setFilterRole,
            options: [
              { label: 'Semua Role', value: 'ALL' },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'OPD', value: 'OPD' },
              { label: 'Pelapor', value: 'PELAPOR' },
              { label: 'Bupati', value: 'BUPATI' },
            ],
          },
        ]}
        // Data & Columns
        data={filteredUsers}
        columns={columns}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        // Auto-navigation for standard action buttons
        basePath="adm/users"
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        // Row actions dengan custom icon, onClick, tooltip
        // rowActions={[
        //   {
        //     icon: HiPencilAlt,
        //     tooltip: 'Edit User',
        //     color: 'blue',
        //     onClick: (user) => {
        //       setSelectedUser(user);
        //       setOpenEdit(true);
        //     },
        //   },
        // ]}
        loading={loading}
        onDeleteClick={handleDelete}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Hapus Pengguna?"
        message={
          itemToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus pengguna{' '}
              <strong>{itemToDelete.name}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </>
          ) : (
            ''
          )
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmColor="red"
        isLoading={deleteUserMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </>
  );
}
