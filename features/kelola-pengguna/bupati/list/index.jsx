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

// Columns definition untuk tabel Bupati
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

export default function BupatiList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [viewMode, setViewMode] = useViewMode('table', 'bupati-list-view');

  // Fetch data Bupati
  const {
    data: bupatis = [],
    isLoading: loading,
    refetch: refetchBupatis,
  } = useQuery({
    queryKey: ['users', 'BUPATI'],
    queryFn: () => fetchUsersByRole('BUPATI'),
    onError: () => {
      toast.error('Gagal memuat data bupati');
    },
  });

  // Mutation untuk delete
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Bupati berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['users', 'BUPATI'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal menghapus bupati');
    },
  });

  // Local state untuk filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter data
  const filteredData = useMemo(() => {
    return bupatis.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.contactNumber && user.contactNumber.includes(searchQuery))
      );
    });
  }, [bupatis, searchQuery]);

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
        title="Kelola Akun Bupati"
        description="Manajemen akun Bupati (Kepala Daerah) e-Lapor"
        role="adm"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        showRefreshButton={true}
        onRefreshClick={refetchBupatis}
        showCreateButton={true}
        createButtonLabel="Tambah Bupati"
        onCreate={() => router.push('/adm/users/bupati/create')}
        // Data & Columns
        data={filteredData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={columns}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        // Auto-navigation for standard action buttons
        basePath="adm/users/bupati"
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        loading={loading}
        onDeleteClick={handleDelete}
        emptyMessage="Tidak ada data bupati ditemukan"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Hapus Bupati?"
        message={
          itemToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus bupati{' '}
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
