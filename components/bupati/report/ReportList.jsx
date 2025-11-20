'use client';

import ReportFilterBar from '@/components/admin/report/ReportFilterBar';
import ReportGrid from '@/components/bupati/report/ReportGrid';
import ReportTable from '@/components/bupati/report/ReportTable';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ReportModal from '@/components/admin/report/ReportCreateModal';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // format: 2025-04
  });
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const pageSize = isMobile ? 4 : 6;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reports');
      res.data;
      setReports(res.data);
    } catch (error) {
      'Gagal mengambil data laporan:', error;
      toast.error('Gagal mengambil data laporan.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    setFilterStatus('ALL');
    setFilterPriority('ALL');
    setSearchQuery('');
    const now = new Date();
    setSelectedMonth(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    );
    setCurrentPage(1);
  };

  const filteredReports = reports.filter((report) => {
    const statusMatch =
      filterStatus === 'ALL' || report.status === filterStatus;
    const priorityMatch =
      filterPriority === 'ALL' || report.priority === filterPriority;

    const searchMatch =
      report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const reportDate = new Date(report.createdAt);
    const reportMonth = `${reportDate.getFullYear()}-${String(
      reportDate.getMonth() + 1,
    ).padStart(2, '0')}`;

    const monthMatch = reportMonth === selectedMonth;

    return statusMatch && priorityMatch && searchMatch && monthMatch;
  });

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-full p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <PageHeader
          title="Manajemen Laporan"
          showBackButton={false}
          showSearch
          showRefreshButton
          searchQuery={searchQuery}
          onSearchChange={(value) => setSearchQuery(value)}
          onRefreshClick={fetchReports}
          breadcrumbsProps={{
            home: { label: 'Beranda', href: '/bupati-portal/dashboard' },
            customRoutes: {},
          }}
        />

        {/* Filter Bar - Responsive */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <ReportFilterBar
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showCreateButton={false}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>

        {/* Content */}
        {filteredReports.length === 0 ? (
          <EmptyState message="Tidak ada laporan ...">
            <p className="text-sm">Coba ubah filter ...</p>
            <Button
              variant="outline"
              color="secondary"
              size="md"
              onClick={handleResetFilter}
            >
              Reset Filter
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {/* Auto-switch: Grid on mobile, Table on desktop */}
            <div className="rounded-lg overflow-hidden shadow-sm">
              {isMobile ? (
                <ReportGrid reports={paginatedReports} />
              ) : (
                <ReportTable reports={paginatedReports} />
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination
                totalItems={filteredReports.length}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>

      <ReportModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
