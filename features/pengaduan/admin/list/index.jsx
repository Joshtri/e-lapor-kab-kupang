'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  HiOutlineChatAlt2,
  HiOutlinePhotograph,
  HiOutlinePencilAlt,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import ReportStatusModal from '@/features/pengaduan/UpdatePengaduanStatusModal';
import ListGrid, {
  ActionButtonsPresets,
} from '@/components/ui/datatable/ListGrid';
import { fetchReports } from '@/services/reportService';
import { exportToExcel } from '@/utils/export/exportToExcel';
import { getColumns } from './columns';
import CommentModal from '@/features/comments/create/CommentByBupatiModal';

// The PengaduanList component for admin to manage reports
export default function PengaduanList() {
  const router = useRouter();

  // TanStack Query hook for fetching reports
  const {
    data: reports = [],
    isLoading: loading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: () => fetchReports(1, 100), // ✅ Fetch first 100 (no images = fast!)
    onError: () => {
      toast.error('Gagal mengambil data laporan.');
    },
  });

  // Local state for UI
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageReportId, setSelectedImageReportId] = useState(null);

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

  const columns = getColumns(refetchReports);

  return (
    <>
      <ListGrid
        // Page header props
        title="Manajemen Pengaduan"
        role="adm"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        onExportExcel={handleExportExcel}
        showRefreshButton={true}
        onRefreshClick={refetchReports}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCreateButton={true}
        createButtonLabel="Tambah Pengaduan"
        onCreate={() => router.push('/adm/kelola-pengaduan/create')}
        // Filters - auto reset handled by ListGrid
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
        // Data & Columns
        data={filteredReports}
        columns={columns}
        pageSize={6}
        // Auto-navigation for standard action buttons
        basePath="adm/kelola-pengaduan"
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.VIEW,
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        // Row actions dengan custom icon, onClick, tooltip
        rowActions={[
          {
            icon: HiOutlinePhotograph,
            tooltip: 'Lihat Lampiran',
            color: 'blue',
            onClick: (report) => {
              setSelectedImageReportId(report.id);
              setIsImageModalOpen(true);
            },
          },
          {
            icon: HiOutlineCheckCircle,
            tooltip: 'Edit Status Pengaduan',
            color: 'cyan',
            onClick: (report) => {
              setSelectedReport(report);
              setIsStatusModalOpen(true);
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
        rowClassName={(r) =>
          !r.isReadByBupati
            ? 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/20'
            : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
        }
      />

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
    </>
  );
}
