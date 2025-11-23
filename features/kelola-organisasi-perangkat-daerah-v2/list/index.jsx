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
import { fetchOpdsV2, deleteOpdV2 } from '@/services/opdServiceV2';
import { getColumns } from './columns';
import { HiUserGroup } from 'react-icons/hi';
import StaffOpdModal from '@/components/opd/StaffOpdModal';

export default function KelolaOrganisasiListV2() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // TanStack Query hooks for fetching OPDs
  const {
    data: opds = [],
    isLoading: loading,
    refetch: refetchOpds,
  } = useQuery({
    queryKey: ['opds-v2'],
    queryFn: fetchOpdsV2,
    onError: (error) => {
      console.error('Error fetching OPDs:', error);
      toast.error('Gagal memuat data OPD');
    },
  });

  // Mutation for deleting OPD
  const deleteOpdMutation = useMutation({
    mutationFn: deleteOpdV2,
    onSuccess: () => {
      toast.success('OPD berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['opds-v2'] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Gagal menghapus OPD';
      if (errorMessage.includes('related reports')) {
        toast.error('OPD ini memiliki laporan terkait dan tidak dapat dihapus');
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Local state for UI
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');

  // State for Staff Modal
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedOpd, setSelectedOpd] = useState(null);

  // State for Delete Confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter and search
  const filteredOpds = useMemo(() => {
    if (!searchQuery.trim()) return opds;

    const query = searchQuery.toLowerCase();
    return opds.filter((opd) => {
      // const staffNames = opd.staff?.map((s) => s.name).join(' ') || '';
      const searchText = [
        opd.name,
        opd.email,
        opd.telp,
        opd.alamat,
        // staffNames,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchText.includes(query);
    });
  }, [opds, searchQuery]);

  // Delete handler - open confirmation modal
  const handleDelete = (opd) => {
    setItemToDelete(opd);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteOpdMutation.mutate(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Handler untuk lihat staff OPD
  const handleViewStaff = (opd) => {
    setSelectedOpd(opd);
    setIsStaffModalOpen(true);
  };

  // Handler untuk tutup modal
  const handleCloseStaffModal = () => {
    setIsStaffModalOpen(false);
    setSelectedOpd(null);
  };

  // Get columns
  const columns = getColumns();

  return (
    <>
      <LoadingScreen isLoading={deleteOpdMutation.isPending} />

      {/* Modal untuk menampilkan staff OPD */}
      <StaffOpdModal
        isOpen={isStaffModalOpen}
        onClose={handleCloseStaffModal}
        opd={selectedOpd}
      />

      <ListGrid
        // Page header props
        title="Daftar Organisasi Perangkat Daerah"
        description="Halaman ini menampilkan daftar Organisasi Perangkat Daerah (OPD) Kabupaten Kupang, bukan daftar akun staff. Setiap OPD merupakan instansi pemerintah yang bertanggung jawab menangani pengaduan sesuai bidangnya."
        role="adm"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        showRefreshButton={true}
        onRefreshClick={refetchOpds}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCreateButton={true}
        createButtonLabel="Tambah OPD"
        onCreate={() => router.push('/adm/organisasi-perangkat-daerah/create')}
        // Data & Columns
        data={filteredOpds}
        columns={columns}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        // Auto-navigation for standard action buttons
        basePath="adm/organisasi-perangkat-daerah"
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        // Custom action buttons
        customActions={[
          {
            icon: HiUserGroup,
            label: 'Lihat Staff OPD',
            tooltip: 'Lihat Staff OPD',
            color: 'purple',
            onClick: handleViewStaff,
          },
        ]}
        loading={loading}
        onDeleteClick={handleDelete}
        emptyMessage="Tidak ada OPD ditemukan"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Hapus OPD?"
        message={
          itemToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus OPD{' '}
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
        isLoading={deleteOpdMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </>
  );
}
