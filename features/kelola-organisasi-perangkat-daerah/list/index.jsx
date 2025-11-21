'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import ListGrid, {
  ActionButtonsPresets,
} from '@/components/ui/datatable/ListGrid';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import { fetchOpds, deleteOpd } from '@/services/opdService';
import { getColumns } from './columns';

// Kelola Organisasi (OPD) List Component
export default function KelolaOrganisasiList() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // TanStack Query hooks for fetching data
  const {
    data: opds = [],
    isLoading: loading,
    refetch: refetchOpds,
  } = useQuery({
    queryKey: ['opds'],
    queryFn: fetchOpds,
    onError: () => {
      toast.error('Gagal memuat data OPD');
    },
  });

  // Mutation for deleting OPD
  const deleteOpdMutation = useMutation({
    mutationFn: deleteOpd,
    onSuccess: () => {
      toast.success('OPD berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['opds'] });
    },
    onError: (error) => {
      if (error.response?.data?.error === 'OPD_HAS_REPORTS') {
        toast.error('OPD ini memiliki laporan terkait dan tidak dapat dihapus');
      } else {
        toast.error('Gagal menghapus OPD');
      }
    },
  });

  // Local state for UI
  const [viewMode, setViewMode] = useState('table');
  const [filterWilayah, setFilterWilayah] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search
  const filteredOpds = useMemo(() => {
    return opds.filter((opd) => {
      const wilayahMatch =
        filterWilayah === 'ALL' || opd.wilayah === filterWilayah;

      let statusMatch = true;
      if (filterStatus === 'ACTIVE') {
        statusMatch = (opd.reports?.length ?? 0) > 0;
      } else if (filterStatus === 'INACTIVE') {
        statusMatch = (opd.reports?.length ?? 0) === 0;
      }

      const searchMatch = [opd.name, opd.staff?.name, opd.wilayah]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return wilayahMatch && statusMatch && searchMatch;
    });
  }, [opds, filterWilayah, filterStatus, searchQuery]);

  // Delete handler
  const handleDelete = (opd) => {
    deleteOpdMutation.mutate(opd.id);
  };

  // Get columns
  const columns = getColumns();

  return (
    <>
      <LoadingScreen isLoading={deleteOpdMutation.isPending} />

      <ListGrid
        // Page header props
        title="Daftar Organisasi Perangkat Daerah"
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
        onCreate={() => router.push('/adm/org-perangkat-daerah/create')}
        // Filters
        filters={[
          {
            type: 'select',
            label: 'Wilayah',
            value: filterWilayah,
            onChange: setFilterWilayah,
            options: [
              { label: 'Semua Wilayah', value: 'ALL' },
              { label: 'Amarasi', value: 'AMARASI' },
              { label: 'Fatuleu', value: 'FATULEU' },
              { label: 'South Central', value: 'SOUTH_CENTRAL' },
            ],
          },
          {
            type: 'select',
            label: 'Status',
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { label: 'Semua Status', value: 'ALL' },
              { label: 'Aktif (Ada Laporan)', value: 'ACTIVE' },
              { label: 'Tidak Aktif (Tanpa Laporan)', value: 'INACTIVE' },
            ],
          },
        ]}
        // Data & Columns
        data={filteredOpds}
        columns={columns}
        pageSize={10}
        // Auto-navigation for standard action buttons
        basePath="adm/org-perangkat-daerah"
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        loading={loading}
        onDelete={handleDelete}
        isDeletePending={deleteOpdMutation.isPending}
        emptyMessage="Tidak ada OPD ditemukan"
      />
    </>
  );
}
