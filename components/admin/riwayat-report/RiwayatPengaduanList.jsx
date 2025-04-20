'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Button } from 'flowbite-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import ListGrid from '@/components/ui/data-view/ListGrid';
import GridDataList from '@/components/ui/data-view/GridDataList';
import DataCard from '@/components/ui/data-view/DataCard';
import { getStatusColor } from '@/utils/statusColor';
import StatusBadge from '@/components/common/StatusBadge';
import { truncateText } from '@/utils/common';
import TruncatedWithTooltip from '@/components/ui/TruncatedWithTooltip';

export default function RiwayatPengaduanList() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reports');
      setRiwayat(res.data);
    } catch (error) {
      'Gagal mengambil data riwayat:', error;
      toast.error('Gagal mengambil data riwayat.');
    } finally {
      setLoading(false);
    }
  };

  const refreshRiwayat = fetchRiwayat;

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

  const columns = [
    {
      header: 'Nama Pelapor',
      accessor: 'user.name',
      cell: (r) => r.user?.name || 'Anonim',
    },
    {
      header: 'Subjek Laporan',
      accessor: 'title',
      cell: (r) => <TruncatedWithTooltip text={r.title} length={40} />,
    },
    {
      header: 'OPD Dituju',
      accessor: 'opd.name',
      cell: (r) => (
        <TruncatedWithTooltip text={r.opd?.name || '-'} length={30} />
      ),
    },
    {
      header: 'Kategori',
      accessor: 'category',
      cell: (r) => <TruncatedWithTooltip text={r.category} length={25} />,
    },
    {
      header: 'Status',
      accessor: 'Status',

      cell: (r) => <StatusBadge bupati={r.bupatiStatus} opd={r.opdStatus} />,
    },

    {
      header: 'Prioritas',
      accessor: 'priority',
    },
    {
      header: 'Tanggal',
      accessor: 'createdAt',
      cell: (r) => new Date(r.createdAt).toLocaleDateString('id-ID'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto p-6 space-y-6 max-w-full"
    >
      <ListGrid
        title="Riwayat Pengaduan"
        searchBar
        showSearch={searchQuery !== ''}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCreateButton={false}
        onRefreshClick={refreshRiwayat}
        loading={loading}
        data={paginatedRiwayat}
        columns={columns}
        gridComponent={
          <GridDataList
            data={paginatedRiwayat}
            renderItem={(report) => (
              <DataCard
                avatar={report.user?.name || 'Anonim'}
                title={report.title}
                subtitle={report.category}
                meta={new Date(report.createdAt).toLocaleDateString('id-ID')}
                badges={[
                  {
                    label: report.bupatiStatus,
                    color: getStatusColor(report.bupatiStatus),
                  },
                ]}
              />
            )}
          />
        }
        emptyMessage="Tidak ada riwayat pengaduan ditemukan."
        emptyAction={
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        }
        filtersComponent={
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROSES">Proses</option>
                <option value="SELESAI">Selesai</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
            </div>
            <Button color="blue" className="w-full" onClick={handleResetFilter}>
              Reset Filter
            </Button>
          </div>
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
