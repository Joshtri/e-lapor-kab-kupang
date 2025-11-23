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

// Columns definition untuk tabel Staff OPD
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
    header: 'NIP',
    accessor: 'nikMasked',
    cell: (user) => user.nikMasked || '-',
  },
  {
    header: 'No. Kontak',
    accessor: 'contactNumber',
  },
  {
    header: 'OPD',
    accessor: 'opd',
    cell: (user) => {
      return user.opd?.name || (
        <span className="text-gray-400 text-sm italic">Belum di-assign</span>
      );
    },
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

export default function StaffOpdList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [viewMode, setViewMode] = useViewMode('table', 'staff-opd-list-view');

  // Fetch data Staff OPD
  const {
    data: staffs = [],
    isLoading: loading,
    refetch: refetchStaffs,
  } = useQuery({
    queryKey: ['users', 'OPD'],
    queryFn: () => fetchUsersByRole('OPD'),
    onError: () => {
      toast.error('Gagal memuat data staff OPD');
    },
  });

  // Mutation untuk delete
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Staff OPD berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['users', 'OPD'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal menghapus staff OPD');
    },
  });

  // Local state untuk filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpd, setFilterOpd] = useState('ALL');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter data
  const filteredData = useMemo(() => {
    return staffs.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.contactNumber && user.contactNumber.includes(searchQuery)) ||
        (user.opd?.name && user.opd.name.toLowerCase().includes(searchLower));

      const matchOpd =
        filterOpd === 'ALL' ||
        (filterOpd === 'ASSIGNED' && user.opdId) ||
        (filterOpd === 'UNASSIGNED' && !user.opdId);

      return matchSearch && matchOpd;
    });
  }, [staffs, searchQuery, filterOpd]);

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
        title="Kelola Akun Staff OPD"
        description="Manajemen akun Staff Organisasi Perangkat Daerah (menggunakan NIP 18 digit)"
        role="adm"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        showRefreshButton={true}
        onRefreshClick={refetchStaffs}
        showCreateButton={true}
        createButtonLabel="Tambah Staff OPD"
        onCreate={() => router.push('/adm/users/staff-opd/create')}
        viewMode={viewMode}
        setViewMode={setViewMode}
        // Filters
        filters={[
          {
            type: 'select',
            label: 'Status OPD',
            value: filterOpd,
            onChange: setFilterOpd,
            options: [
              { label: 'Semua Staff', value: 'ALL' },
              { label: 'Sudah di-assign OPD', value: 'ASSIGNED' },
              { label: 'Belum di-assign OPD', value: 'UNASSIGNED' },
            ],
          },
        ]}
        // Data & Columns
        data={filteredData}
        columns={columns}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        // Auto-navigation for standard action buttons
        basePath="adm/users/staff-opd"
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        loading={loading}
        onDeleteClick={handleDelete}
        emptyMessage="Tidak ada data staff OPD ditemukan"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Hapus Staff OPD?"
        message={
          itemToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus staff OPD{' '}
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
