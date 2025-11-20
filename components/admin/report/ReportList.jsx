'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
// Icons no longer needed here - handled by ActionButtonsPresets in ListGrid
import { toast } from 'sonner';

import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import PriorityBadge from '@/components/common/PriorityBadge';
import ReportStatusModal from '@/components/common/ReportStatusModal';
import StatusBadge from '@/components/common/StatusBadge';
import ListGrid, {
  ActionButtonsPresets,
} from '@/components/ui/datatable/ListGrid';
import { fetchReports } from '@/services/reportService';
import { truncateText } from '@/utils/common';
import { exportToExcel } from '@/utils/export/exportToExcel';
import CommentModal from '../comment/CommentModal';
import InlineOPDSelector from './InlineOPDSelector';
import ReportCreateModal from './ReportCreateModal';

export default function ReportList() {
  // TanStack Query hook for fetching reports
  const {
    data: reports = [],
    isLoading: loading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
    onError: () => {
      toast.error('Gagal mengambil data laporan.');
    },
  });

  // Local state for UI
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [openModal, setOpenModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageReportId, setSelectedImageReportId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPriority, searchQuery]);

  const handleExportExcel = () => {
    const exportData = filteredReports.map((report) => ({
      Title: report.title,
      Description: report.description,
      Category: report.category,
      Priority: report.priority,
      BupatiStatus: report.bupatiStatus,
      OpdStatus: report.opdStatus,
      UserName: report.user?.name,
      OpdName: report.opd?.name,
      CreatedAt: report.createdAt,
    }));

    exportToExcel({
      data: exportData,
      columns: [
        { header: 'Judul', key: 'Title' },
        { header: 'Deskripsi', key: 'Description' },
        { header: 'Kategori', key: 'Category' },
        { header: 'Prioritas', key: 'Priority' },
        { header: 'Status Bupati', key: 'BupatiStatus' },
        { header: 'Status OPD', key: 'OpdStatus' },
        { header: 'Nama Pengguna', key: 'UserName' },
        { header: 'Nama OPD', key: 'OpdName' },
        { header: 'Tanggal Dibuat', key: 'CreatedAt' },
      ],
      filename: 'data_laporan',
    });
  };

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPriority, searchQuery]);

  const handleResetFilter = () => {
    setFilterStatus('ALL');
    setFilterPriority('ALL');
    setSearchQuery('');
  };

  const columns = [
    {
      header: 'Subjek',
      accessor: 'title',
      gridSection: 'header',
      gridHighlight: true,
      cell: (r) => truncateText(r.title, 45),
      gridBadge: {
        show: (r) => !r.isReadByAdmin,
        text: 'Baru',
        colorClass:
          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      },
    },
    {
      header: 'Pelapor',
      accessor: 'user.name',
      gridSection: 'header',
      cell: (r) => r.user?.name || 'Anonim',
    },
    {
      header: 'Kategori',
      accessor: 'category',
      gridSection: 'header',
      cell: (r) => truncateText(r.category, 20),
    },
    {
      header: 'OPD',
      accessor: 'opd.name',
      gridSection: 'header',
      cell: (r) => <InlineOPDSelector report={r} onUpdated={refetchReports} />,
    },
    {
      header: 'Prioritas',
      accessor: 'priority',
      gridSection: 'header',
      cell: (r) => <PriorityBadge priority={r.priority} />,
    },
    {
      header: 'Status',
      accessor: 'bupatiStatus',
      gridSection: 'header',
      cell: (r) => <StatusBadge bupati={r.bupatiStatus} opd={r.opdStatus} />,
    },
    {
      header: 'Tanggal',
      accessor: 'createdAt',
      gridSection: 'footer',
      cell: (r) =>
        new Date(r.createdAt).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-full mx-auto p-4 space-y-6"
    >
      <ListGrid
        // Page header props
        title="Manajemen Pengaduan"
        role="adm"
        showBackButton={false}
        searchBar={true}
        showSearch={searchQuery !== ''}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        onExportExcel={handleExportExcel}
        showRefreshButton={true}
        onRefreshClick={refetchReports}
        // }}
        // Filter bar props
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCreateButton={true}
        createButtonLabel="Tambah Pengaduan"
        onCreate={() => setOpenModal(true)}
        // New: Use filters array instead of filtersComponent
        filters={[
          {
            type: 'select',
            label: 'Status',
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { label: 'Semua Status', value: 'ALL' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Process', value: 'PROCESS' },
              { label: 'Done', value: 'DONE' },
              { label: 'Rejected', value: 'REJECTED' },
            ],
          },
          {
            type: 'select',
            label: 'Prioritas',
            value: filterPriority,
            onChange: setFilterPriority,
            options: [
              { label: 'Semua Prioritas', value: 'ALL' },
              { label: 'Low', value: 'LOW' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'High', value: 'HIGH' },
            ],
          },
        ]}
        onResetFilters={handleResetFilter}
        // Main data props
        data={paginatedReports}
        columns={columns}
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.COMMENT,
          ActionButtonsPresets.EDIT, // Edit button untuk ubah status
        ]}
        loading={loading}
        emptyMessage="Tidak ada laporan yang ditemukan"
        emptyAction={
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        }
        rowClassName={(r) =>
          !r.isReadByAdmin
            ? 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/20'
            : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
        }
        // Pagination props
        paginationProps={{
          totalItems: filteredReports.length,
          currentPage: currentPage,
          pageSize: pageSize,
          onPageChange: (page) => setCurrentPage(page),
        }}
        // Action button callbacks
        onViewClick={(report) =>
          (window.location.href = `/adm/kelola-pengaduan/${report.id}`)
        }
        onCommentClick={(report) => {
          setSelectedReport(report);
          setIsCommentModalOpen(true);
        }}
        onEditClick={(report) => {
          setSelectedReport(report);
          setIsStatusModalOpen(true);
        }}
      />

      <ReportCreateModal openModal={openModal} setOpenModal={setOpenModal} />
      {selectedReport && (
        <ReportStatusModal
          open={isStatusModalOpen}
          setOpen={setIsStatusModalOpen}
          report={selectedReport}
          role="ADMIN"
          onSuccess={refetchReports}
        />
      )}
      {selectedReport && (
        <CommentModal
          open={isCommentModalOpen}
          setOpen={setIsCommentModalOpen}
          reportId={selectedReport.id}
        />
      )}
      {selectedImageReportId && (
        <ImagePreviewModal
          open={isImageModalOpen}
          setOpen={setIsImageModalOpen}
          reportId={selectedImageReportId}
          type="report"
        />
      )}
    </motion.div>
  );
}
