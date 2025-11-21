'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  HiOutlinePhotograph,
  HiOutlineCheckCircle,
  HiOutlineChatAlt2,
} from 'react-icons/hi';

import ListGrid from '@/components/ui/datatable/ListGrid';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import ReportStatusModal from '@/features/pengaduan/UpdatePengaduanStatusModal';
import CommentByBupatiModal from '@/features/comments/create/CommentByBupatiModal';
import { fetchReports } from '@/services/reportService';
import { getColumns } from './columns';

// Pengaduan Bupati List Component
export default function PengaduanBupatiList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // TanStack Query hooks for fetching reports
  const {
    data: reports = [],
    isLoading: loading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['reports-bupati'],
    queryFn: () => fetchReports(1, 100),
    onError: () => {
      toast.error('Gagal mengambil data laporan.');
    },
  });

  // Mutation for marking report as read
  const markAsReadMutation = useMutation({
    mutationFn: async (reportId) => {
      const res = await fetch(`/api/reports/${reportId}/mark-read-bupati`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Gagal update status terbaca');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports-bupati'] });
    },
    onError: () => {
      toast.error('Gagal update status terbaca');
    },
  });

  // Local state for UI
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedImageReportId, setSelectedImageReportId] = useState(null);

  // Filter and search
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const statusMatch =
        filterStatus === 'ALL' || report.bupatiStatus === filterStatus;
      const priorityMatch =
        filterPriority === 'ALL' || report.opdStatus === filterPriority;
      const searchMatch = [
        report.title,
        report.description,
        report.category,
        report.user?.name,
        report.opd?.name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return statusMatch && priorityMatch && searchMatch;
    });
  }, [reports, filterStatus, filterPriority, searchQuery]);

  // Handle view detail dengan mark as read
  const handleViewDetail = async (report) => {
    try {
      if (!report.isReadByBupati) {
        await markAsReadMutation.mutateAsync(report.id);
      }
      router.push(`/bupati-portal/kelola-pengaduan/${report.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Get columns
  const columns = getColumns();

  return (
    <>
      <LoadingScreen isLoading={markAsReadMutation.isPending} />

      <ListGrid
        // Page header props
        title="Manajemen Pengaduan"
        role="bupati"
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
        // Custom row action (View Detail)
        onRowClick={(report) => handleViewDetail(report)}
        loading={loading}
        isDeletePending={markAsReadMutation.isPending}
        rowClassName={(r) =>
          !r.isReadByBupati
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
        emptyMessage="Tidak ada laporan"
      />

      {/* Modal Status */}
      {selectedReport && (
        <ReportStatusModal
          open={isStatusModalOpen}
          setOpen={setIsStatusModalOpen}
          report={selectedReport}
          role="BUPATI"
          onSuccess={refetchReports}
        />
      )}

      {/* Modal Komentar */}
      {selectedReport && (
        <CommentByBupatiModal
          open={isCommentModalOpen}
          setOpen={setIsCommentModalOpen}
          reportId={selectedReport.id}
        />
      )}

      {/* Modal Image Preview */}
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
