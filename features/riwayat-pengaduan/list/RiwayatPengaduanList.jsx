'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchReports } from '@/services/reportService';

import ListGrid from '@/components/ui/datatable/ListGrid';
import { getColumns } from './columns';

export default function RiwayatPengaduanList() {
  // TanStack Query hook for fetching reports
  const {
    data: reports = [],
    isLoading: loading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['riwayatReports'],
    queryFn: () => fetchReports(1, 100),
    onError: () => {
      toast.error('Gagal mengambil data riwayat.');
    },
  });

  // Local state for UI
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const statusMatch =
        filterStatus === 'ALL' || report.bupatiStatus === filterStatus;
      const searchMatch = [
        report.title,
        report.description,
        report.category,
        report.user?.name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [reports, filterStatus, searchQuery]);

  // Get columns
  const columns = getColumns();

  return (
    <ListGrid
      // Page header props
      title="Riwayat Pengaduan"
      role="adm"
      showBackButton={false}
      searchBar={true}
      searchQuery={searchQuery}
      onSearchChange={(val) => setSearchQuery(val)}
      showRefreshButton={true}
      onRefreshClick={refetchReports}
      viewMode={viewMode}
      setViewMode={setViewMode}
      showCreateButton={false}
      // Filters
      filters={[
        {
          type: 'select',
          label: 'Status',
          value: filterStatus,
          onChange: setFilterStatus,
          options: [
            { label: 'Semua Status', value: 'ALL' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Proses', value: 'PROSES' },
            { label: 'Selesai', value: 'SELESAI' },
            { label: 'Ditolak', value: 'DITOLAK' },
          ],
        },
      ]}
      // Data & Columns
      data={filteredReports}
      columns={columns}
      pageSize={10}
      loading={loading}
      emptyMessage="Tidak ada riwayat pengaduan"
      emptyDescription="Belum ada data riwayat pengaduan untuk ditampilkan."
      rowClassName={(r) =>
        !r.isReadByBupati
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }
    />
  );
}
