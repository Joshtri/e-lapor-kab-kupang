'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import {
  HiOutlineOfficeBuilding,
  HiOutlineEye,
  HiOutlineTrash,
  HiExclamation,
} from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ListGrid from '@/components/ui/datatable/ListGrid';
// import GridDataList from '@/components/ui/datatable/GridDataList';
// import DataCard from '@/components/ui/datatable/_DataCard';
import TruncatedWithTooltip from '@/components/ui/TruncatedWithTooltip';
import ActionsButton from '@/components/ui/ActionsButton';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { MdEdit } from 'react-icons/md';
import { fetchOpds, deleteOpd } from '@/services/opdService';

export default function OPDList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pageSize = 10;

  // TanStack Query
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

  // Delete mutation
  const deleteOpdMutation = useMutation({
    mutationFn: deleteOpd,
    onSuccess: () => {
      toast.success('OPD berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['opds'] });
      setDeleteModalOpen(false);
      setOpdToDelete(null);
    },
    onError: (error) => {
      if (error.response?.data?.error === 'OPD_HAS_REPORTS') {
        toast.error('OPD ini memiliki laporan terkait dan tidak dapat dihapus');
      } else {
        toast.error('Gagal menghapus OPD');
      }
    },
  });

  // Local state
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWilayah, setFilterWilayah] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opdToDelete, setOpdToDelete] = useState(null);

  // Advanced filtering
  const filteredOpds = useMemo(() => {
    return opds.filter((opd) => {
      // Wilayah filter
      const wilayahMatch =
        filterWilayah === 'ALL' || opd.wilayah === filterWilayah;

      // Status filter (active/inactive based on reports)
      let statusMatch = true;
      if (filterStatus === 'ACTIVE') {
        statusMatch = (opd.reports?.length ?? 0) > 0;
      } else if (filterStatus === 'INACTIVE') {
        statusMatch = (opd.reports?.length ?? 0) === 0;
      }

      // Search filter
      const searchMatch = [opd.name, opd.staff?.name, opd.wilayah]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return wilayahMatch && statusMatch && searchMatch;
    });
  }, [opds, filterWilayah, filterStatus, searchQuery]);

  const paginatedOpds = useMemo(() => {
    return filteredOpds.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [filteredOpds, currentPage]);

  const handleResetFilter = () => {
    setFilterWilayah('ALL');
    setFilterStatus('ALL');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleDeleteClick = (opd) => {
    setOpdToDelete(opd);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!opdToDelete) return;
    deleteOpdMutation.mutate(opdToDelete.id);
  };

  // Cleaned up columns - only important fields
  const columns = [
    {
      header: 'Nama OPD',
      accessor: 'name',
      width: 'w-1/4',
      cell: (opd) => <TruncatedWithTooltip text={opd.name} length={25} />,
    },
    {
      header: 'Staff PJ',
      accessor: 'staff.name',
      width: 'w-1/4',
      cell: (opd) => opd.staff?.name || '-',
    },
    {
      header: 'Wilayah',
      accessor: 'wilayah',
      width: 'w-1/6',
    },
    {
      header: 'Laporan',
      accessor: 'reports',
      width: 'w-1/12',
      cell: (opd) => (
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm font-medium">
          {opd.reports?.length ?? 0}
        </span>
      ),
    },
  ];

  const actionsButton = [
    (r) => (
      <ActionsButton
        icon={HiOutlineEye}
        tooltip={`Lihat detail ${r.name}`}
        color="gray"
        onClick={() => router.push(`/adm/org-perangkat-daerah/${r.id}`)}
      />
    ),

    (r) => (
      <ActionsButton
        icon={MdEdit}
        tooltip={`Edit OPD ${r.name}`}
        color="blue"
        onClick={() => router.push(`/adm/org-perangkat-daerah/${r.id}/edit`)}
      />
    ),

    (r) => (
      <ActionsButton
        icon={HiOutlineTrash}
        tooltip={`Hapus OPD ${r.name}`}
        color="red"
        onClick={() => handleDeleteClick(r)}
        // disabled={r.reports?.length > 0}
      />
    ),
  ];

  return (
    <>
      <div className="p-4 space-y-6">
        <ListGrid
          // breadcrumbsProps={{
          //   home: { label: 'Beranda', href: '/adm/dashboard' },
          //   customRoutes: {
          //     'org-perangkat-daerah': {
          //       label: 'Organisasi Perangkat Daerah',
          //       href: '/adm/org-perangkat-daerah',
          //     },
          //   },
          // }}
          title="Daftar OPD"
          showBackButton={false}
          searchBar
          searchQuery={searchQuery}
          actionButtons={actionsButton}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          viewMode={viewMode}
          setViewMode={setViewMode}
          columns={columns}
          data={paginatedOpds}
          loading={loading}
          showCreateButton
          createButtonLabel="Tambah OPD"
          onCreate={() => router.push('/adm/org-perangkat-daerah/create')}
          filtersComponent={
            <div className="space-y-3">
              {/* Filter Wilayah */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Wilayah
                </label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={filterWilayah}
                  onChange={(e) => {
                    setFilterWilayah(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="ALL">Semua Wilayah</option>
                  <option value="AMARASI">Amarasi</option>
                  <option value="FATULEU">Fatuleu</option>
                  <option value="SOUTH_CENTRAL">South Central</option>
                </select>
              </div>

              {/* Filter Status */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="ALL">Semua Status</option>
                  <option value="ACTIVE">Aktif (Ada Laporan)</option>
                  <option value="INACTIVE">Tidak Aktif (Tanpa Laporan)</option>
                </select>
              </div>

              <Button
                color="gray"
                className="w-full"
                onClick={handleResetFilter}
              >
                Reset Semua Filter
              </Button>
            </div>
          }
          paginationProps={{
            totalItems: filteredOpds.length,
            currentPage,
            pageSize,
            onPageChange: setCurrentPage,
          }}
          emptyMessage="Tidak ada OPD ditemukan"
          emptyAction={
            <Button color="gray" onClick={handleResetFilter}>
              Reset Filter
            </Button>
          }
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Hapus OPD?"
        message={
          <>
            Apakah Anda yakin ingin menghapus OPD{' '}
            <span className="font-bold">{opdToDelete?.name}</span>?
          </>
        }
        confirmText="Ya, Hapus OPD"
        cancelText="Batal"
        confirmColor="red"
        isLoading={deleteOpdMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        icon={HiExclamation}
      />
    </>
  );
}
