'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Button } from 'flowbite-react';
import { toast } from 'sonner';
import {
  HiOutlinePhotograph,
  HiOutlineCheckCircle,
  HiOutlineChatAlt2,
} from 'react-icons/hi';
import ListGrid from '@/components/ui/datatable/ListGrid';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import PengaduanDetailOPD from '@/features/pengaduan/opd/detail';
import CommentByOpdModal from '@/features/comments/CommentByOpdModal';
import { getColumns } from './columns';

export default function PengaduanListOPD() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reports/opd');
      setReports(res.data);
    } catch (error) {
      console.error('Gagal ambil laporan:', error);
      toast.error('Gagal mengambil data laporan.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const bupatiMatch =
      filterStatus === 'ALL' || report.bupatiStatus === filterStatus;
    const opdMatch =
      filterPriority === 'ALL' || report.opdStatus === filterPriority;
    const searchMatch = [
      report.title,
      report.description,
      report.category,
      report.priority,
      report.bupatiStatus,
      report.opdStatus,
      report.user?.name,
      report.opd?.name,
      report.createdAt,
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return bupatiMatch && opdMatch && searchMatch;
  });

  const columns = getColumns();

  return (
    <>
      <ListGrid
        // Page header props
        title="Manajemen Laporan"
        role="opd"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        showRefreshButton={true}
        onRefreshClick={fetchReports}
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
          {
            type: 'select',
            label: 'Status OPD',
            value: filterPriority,
            onChange: setFilterPriority,
            options: [
              { label: 'Semua Status OPD', value: 'ALL' },
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
        // Row actions
        rowActions={[
          {
            icon: HiOutlineCheckCircle,
            tooltip: 'Lihat Detail',
            color: 'cyan',
            onClick: (report) => {
              setSelectedReport(report);
              setIsDetailModalOpen(true);
            },
          },
          {
            icon: HiOutlineChatAlt2,
            tooltip: 'Komentar',
            color: 'purple',
            onClick: (report) => {
              setSelectedReport(report);
              setIsCommentModalOpen(true);
            },
          },
        ]}
        loading={loading}
        emptyMessage="Tidak ada laporan yang cocok dengan filter saat ini."
      />

      {/* Detail Modal */}
      {selectedReport && (
        <PengaduanDetailOPD
          report={selectedReport}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReport(null);
          }}
        />
      )}

      {/* Comment Modal */}
      {selectedReport && (
        <CommentByOpdModal
          open={isCommentModalOpen}
          setOpen={setIsCommentModalOpen}
          reportId={selectedReport.id}
        />
      )}
    </>
  );
}
