'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import ListGrid, {
  ActionButtonsPresets,
} from '@/components/ui/datatable/ListGrid';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { fetchUsersByRole, deleteUser } from '@/services/userService';
import { useViewMode } from '@/hooks/useViewMode'; // Custom hook untuk viewMode management

// Columns definition untuk tabel Admin
const getColumns = () => [
  {
    header: 'Nama Lengkap',
    accessor: 'name',
  },
  {
    header: 'Email',
    accessor: 'email',
  },
  {
    header: 'NIK',
    accessor: 'nikMasked',
    cell: (user) => user.nikMasked || '-',
  },
  {
    header: 'No. Kontak',
    accessor: 'contactNumber',
  },
  {
    header: 'Tanggal Daftar',
    accessor: 'createdAt',
    cell: (user) => {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
];

export default function AdminList() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 🎯 Menggunakan CARA 2: Custom Hook dengan localStorage persistence
  // User preference akan tersimpan, jadi setiap kali buka halaman ini
  // view mode akan kembali ke pilihan terakhir user (table/grid)
  const [viewMode, setViewMode] = useViewMode('table', 'admin-list-view');
  // Fetch data Admin
  const {
    data: admins = [],
    isLoading: loading,
    refetch: refetchAdmins,
  } = useQuery({
    queryKey: ['users', 'ADMIN'],
    queryFn: () => fetchUsersByRole('ADMIN'),
    onError: () => {
      toast.error('Gagal memuat data admin');
    },
  });

  // Mutation untuk delete
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Admin berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['users', 'ADMIN'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal menghapus admin');
    },
  });

  // Local state untuk filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter data
  const filteredData = useMemo(() => {
    return admins.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.contactNumber && user.contactNumber.includes(searchQuery))
      );
    });
  }, [admins, searchQuery]);

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

  // Get columns
  const columns = getColumns();

  return (
    <>
      <LoadingScreen isLoading={deleteUserMutation.isPending} />

      <ListGrid
        // Page header props
        title="Kelola Akun Admin"
        description="Manajemen akun administrator sistem e-Lapor"
        role="adm"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        showRefreshButton={true}
        onRefreshClick={refetchAdmins}
        showCreateButton={true}
        createButtonLabel="Tambah Admin"
        onCreate={() => router.push('/adm/users/admin/create')}
        // Data & View Mode
        viewMode={viewMode}
        setViewMode={setViewMode}
        data={filteredData}
        columns={columns}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        // Auto-navigation for standard action buttons
        basePath="adm/users/admin"
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        loading={loading}
        onDeleteClick={handleDelete}
        emptyMessage="Tidak ada data admin ditemukan"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Hapus Admin?"
        message={
          itemToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus admin{' '}
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
