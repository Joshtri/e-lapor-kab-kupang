'use client';

import axios from 'axios';
import { Button } from 'flowbite-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  HiCheckCircle,
  HiOutlineChatAlt2,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlinePencilAlt,
} from 'react-icons/hi';
import { toast } from 'sonner';

import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import PriorityBadge from '@/components/common/PriorityBadge';
import ReportStatusModal from '@/components/common/ReportStatusModal';
import StatusBadge from '@/components/common/StatusBadge';
import ActionsButton from '@/components/ui/ActionsButton';
import DataCard from '@/components/ui/data-view/DataCard';
import GridDataList from '@/components/ui/data-view/GridDataList';
import ListGrid from '@/components/ui/data-view/ListGrid';
import { truncateText } from '@/utils/common';
import { exportToExcel } from '@/utils/export/exportToExcel';
import { getStatusColor } from '@/utils/statusColor';
import CommentModal from '../comment/CommentModal';
import InlineOPDSelector from './InlineOPDSelector';
import ReportCreateModal from './ReportCreateModal';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reports');
      setReports(res.data);
    } catch (error) {
      console.error('Gagal mengambil data laporan:', error);
      toast.error('Gagal mengambil data laporan.');
    } finally {
      setLoading(false);
    }
  };

  const refreshReports = fetchReports;

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
      header: 'Nama Pelapor',
      accessor: 'user.name',
      cell: (r) => r.user?.name || 'Anonim',
    },
    {
      header: 'Subjek',
      accessor: 'title',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <span className="truncate max-w-[180px]">
            {truncateText(r.title, 40)}
          </span>
          {!r.isReadByAdmin ? (
            <HiOutlineClock className="text-yellow-500 w-4 h-4" />
          ) : (
            <HiCheckCircle className="text-green-500 w-4 h-4" />
          )}
        </div>
      ),
    },
    {
      header: 'Kategori',
      accessor: 'category',
      cell: (r) => truncateText(r.category, 20),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (r) => <StatusBadge bupati={r.bupatiStatus} opd={r.opdStatus} />,
    },
    {
      header: 'OPD Terkait',
      accessor: 'opd',
      cell: (r) => <InlineOPDSelector report={r} onUpdated={fetchReports} />,
    },
    {
      header: 'Prioritas',
      accessor: 'priority',
      cell: (r) => <PriorityBadge priority={r.priority} />,
    },
    {
      header: 'Tanggal',
      accessor: 'createdAt',
      cell: (r) => new Date(r.createdAt).toLocaleDateString('id-ID'),
    },
    {
      header: 'Lampiran',
      accessor: 'attachment',
      width: 'w-[100px]',
      cell: (r) => (
        <Button
          size="xs"
          color="gray"
          className="p-2"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImageReportId(r.id);
            setIsImageModalOpen(true);
          }}
        >
          🖼️
        </Button>
      ),
    },
  ];

  const actionButtons = [
    (r) => (
      <ActionsButton
        icon={HiOutlineEye}
        tooltip="Lihat Detail"
        color="gray"
        onClick={() => (window.location.href = `/adm/report-warga/${r.id}`)}
      />
    ),
    (r) => (
      <ActionsButton
        icon={HiOutlineChatAlt2}
        tooltip="Komentar"
        color="purple"
        onClick={() => {
          setSelectedReport(r);
          setIsCommentModalOpen(true);
        }}
      />
    ),
    (r) => (
      <ActionsButton
        icon={HiOutlinePencilAlt}
        tooltip="Ubah Status"
        color="blue"
        onClick={() => {
          setSelectedReport(r);
          setIsStatusModalOpen(true);
        }}
      />
    ),
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
        showBackButton={false}
        searchBar={true}
        showSearch={searchQuery !== ''}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        onExportExcel={handleExportExcel}
        showRefreshButton={true}
        onRefreshClick={fetchReports}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },
          customRoutes: {
            adm: { label: 'Dashboard Admin', href: '/adm/dashboard' },
          },
        }}
        // Filter bar props
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCreateButton={true}
        createButtonLabel="Tambah Pengaduan"
        onCreate={() => setOpenModal(true)}
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
                <option value="PROCESS">Process</option>
                <option value="DONE">Done</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Prioritas
              </label>
              <select
                className="w-full p-2 border rounded"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="ALL">Semua Prioritas</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <Button color="blue" className="w-full" onClick={handleResetFilter}>
              Reset Filter
            </Button>
          </div>
        }
        // Main data props
        data={paginatedReports}
        columns={columns}
        actionButtons={actionButtons}
        gridComponent={
          <GridDataList
            data={paginatedReports}
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
                  { label: report.priority, color: 'blue' },
                ]}
              />
            )}
          />
        }
        loading={loading}
        emptyMessage="Tidak ada laporan yang ditemukan"
        emptyAction={
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        }
        rowClassName={(r) =>
          !r.isReadByAdmin
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
        // Pagination props
        paginationProps={{
          totalItems: filteredReports.length,
          currentPage: currentPage,
          pageSize: pageSize,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      <ReportCreateModal openModal={openModal} setOpenModal={setOpenModal} />
      {selectedReport && (
        <ReportStatusModal
          open={isStatusModalOpen}
          setOpen={setIsStatusModalOpen}
          report={selectedReport}
          role="ADMIN"
          onSuccess={refreshReports}
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
