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
import useViewMode from '@/hooks/useViewMode';

// Columns definition untuk tabel Pelapor
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

export default function PelaporList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [viewMode, setViewMode] = useViewMode('table', 'pelapor-list-view');

  // Fetch data Pelapor
  const {
    data: pelapors = [],
    isLoading: loading,
    refetch: refetchPelapors,
  } = useQuery({
    queryKey: ['users', 'PELAPOR'],
    queryFn: () => fetchUsersByRole('PELAPOR'),
    onError: () => {
      toast.error('Gagal memuat data pelapor');
    },
  });

  // Mutation untuk delete
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Pelapor berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['users', 'PELAPOR'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal menghapus pelapor');
    },
  });

  // Local state untuk filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter data
  const filteredData = useMemo(() => {
    return pelapors.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.contactNumber && user.contactNumber.includes(searchQuery))
      );
    });
  }, [pelapors, searchQuery]);

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
        title="Kelola Akun Pelapor"
        description="Manajemen akun masyarakat (pelapor) yang menggunakan aplikasi e-Lapor"
        role="adm"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        showRefreshButton={true}
        onRefreshClick={refetchPelapors}
        showCreateButton={true}
        createButtonLabel="Tambah Pelapor"
        onCreate={() => router.push('/adm/users/pelapor/create')}
        // Data & Columns
        data={filteredData}
        columns={columns}
        viewMode={viewMode}
        setViewMode={setViewMode}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        // Auto-navigation for standard action buttons
        basePath="adm/users/pelapor"
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        loading={loading}
        onDeleteClick={handleDelete}
        emptyMessage="Tidak ada data pelapor ditemukan"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Hapus Pelapor?"
        message={
          itemToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus pelapor{' '}
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
