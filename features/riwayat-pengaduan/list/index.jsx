'use client';

import { useState } from 'react';
import { Button } from 'flowbite-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { fetchReports } from '@/services/reportService';

import ListGrid from '@/components/ui/datatable/ListGrid';
import { getColumns } from './columns';

export default function RiwayatPengaduanList() {
//   const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Fetch reports using TanStack Query
  const {
    data: riwayat = [],
    isLoading: loading,
    refetch: refetchRiwayat,
  } = useQuery({
    queryKey: ['riwayatReports'],
    queryFn: fetchReports,
    onError: () => {
      toast.error('Gagal mengambil data riwayat.');
    },
  });

  const filteredRiwayat = riwayat.filter((r) => {
    const statusMatch =
      filterStatus === 'ALL' || r.bupatiStatus === filterStatus;
    const searchMatch = [r.title, r.description, r.user?.name, r.category]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const paginatedRiwayat = filteredRiwayat.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleResetFilter = () => {
    setFilterStatus('ALL');
    setSearchQuery('');
  };

  const columns = getColumns();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto p-6 space-y-6 max-w-full"
    >
      <ListGrid
        title="Riwayat Pengaduan"
        searchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        // viewMode={viewMode}
        // setViewMode={setViewMode}
        showCreateButton={false}
        onRefreshClick={refetchRiwayat}
        loading={loading}
        data={paginatedRiwayat}
        columns={columns}
        filters={[
          {
            type: 'select',
            label: 'Status',
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: 'ALL', label: 'Semua Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'PROSES', label: 'Proses' },
              { value: 'SELESAI', label: 'Selesai' },
              { value: 'DITOLAK', label: 'Ditolak' },
            ],
          },
        ]}
        emptyMessage="Tidak ada riwayat pengaduan ditemukan."
        emptyAction={
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        }
        paginationProps={{
          totalItems: filteredRiwayat.length,
          currentPage,
          pageSize,
          onPageChange: setCurrentPage,
        }}
      />
    </motion.div>
  );
}
