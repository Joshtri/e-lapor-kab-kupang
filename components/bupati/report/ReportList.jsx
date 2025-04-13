'use client';

import ReportFilterBar from '@/components/admin/report/ReportFilterBar';
import ReportGrid from '@/components/bupati/report/ReportGrid';
import ReportTable from '@/components/bupati/report/ReportTable';
import PageHeader from '@/components/ui/page-header';
import axios from 'axios';
import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ReportModal from '@/components/admin/report/ReportCreateModal';
import EmptyState from '@/components/ui/empty-state';
import Pagination from '@/components/ui/Pagination';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // format: 2025-04
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reports');
      console.log(res.data);
      setReports(res.data);
    } catch (error) {
      console.error('Gagal mengambil data laporan:', error);
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
    <div className="max-w-full mx-auto p-4 space-y-6">
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
          'bupati-portal': {
            label: 'Bupati Portal',
            href: '/bupati-portal/dashboard',
          },
          customRoutes: {
            adm: { label: 'Dashboard Admin', href: '/adm/dashboard' },
          },
        }}
      />
      <div className="flex items-center justify-between">
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
      {filteredReports.length === 0 ? (
        <EmptyState message="Tidak ada laporan ...">
          <p className="text-sm">Coba ubah filter ...</p>
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        </EmptyState>
      ) : (
        <>
          {viewMode === 'table' ? (
            <ReportTable reports={paginatedReports} />
          ) : (
            <ReportGrid reports={paginatedReports} />
          )}

          {/* Panggil Pagination di sini */}
          <Pagination
            totalItems={filteredReports.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ReportModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
