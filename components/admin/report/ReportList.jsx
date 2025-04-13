'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Modal, Button } from 'flowbite-react';
import { toast } from 'sonner';
import ReportFilterBar from '@/components/admin/report/ReportFilterBar';
import ReportGrid from '@/components/admin/report/ReportGridView';
import ReportTable from '@/components/admin/report/ReportTable';
import PageHeader from '@/components/ui/page-header';
import ReportCreateModal from './ReportCreateModal';
import { HiOutlinePlus } from 'react-icons/hi';
import EmptyState from '@/components/ui/empty-state';
import { exportToExcel } from '@/utils/export/exportToExcel';
import Pagination from '@/components/ui/Pagination';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(''); // ✅ NEW

  const [filterPriority, setFilterPriority] = useState('ALL');
  const [openModal, setOpenModal] = useState(false); // ✅ State untuk modal
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

  const handleExportExcel = () => {
    const exportData = filteredUsers.map((report) => ({
      Title: report.title,
      Description: report.description,
      Category: report.category,
      Priority: report.priority,
      BupatiStatus: report.bupatiStatus,
      OpdStatus: report.opdStatus,
      UserName: report.user?.name, //Mengganti key dengan yang lebih spesifik
      OpdName: report.opd?.name, //Mengganti key dengan yang lebih spesifik
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
        { header: 'Nama Pengguna', key: 'UserName' }, // Mengganti header dan key sesuai dengan data
        { header: 'Nama OPD', key: 'OpdName' }, // Mengganti header dan key sesuai dengan data
        { header: 'Tanggal Dibuat', key: 'CreatedAt' },
      ],
      filename: 'data_laporan', // Mengganti nama file sesuai dengan data
    });
  };

  const handleResetFilter = () => {
    setFilterStatus('ALL');
    setFilterPriority('ALL');
    setSearchQuery('');
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
        searchQuery={searchQuery} // ✅ linked
        onSearchChange={(val) => setSearchQuery(val)} // ✅ ADD THIS LINE
        onExportExcel={handleExportExcel}
        showRefreshButton
        onRefreshClick={fetchReports}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },
          customRoutes: {
            adm: { label: 'Dashboard Admin', href: '/adm/dashboard' },
          },
        }}
      />
      <div className="flex justify-between items-center mb-6">
        <ReportFilterBar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          viewMode={viewMode}
          setViewMode={setViewMode}
          createButtonLabel="Buat Laporan"
          onCreateClick={() => setOpenModal(true)} // ✅ Buka modal saat klik tombol
        />

        <Button
          color="blue"
          onClick={() => setOpenModal(true)}
          icon={HiOutlinePlus}
        >
          Tambah Pengaduan
        </Button>
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

      <ReportCreateModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
