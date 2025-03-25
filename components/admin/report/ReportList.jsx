'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Modal, Button } from 'flowbite-react';
import { toast } from 'sonner';
import ReportFilterBar from '@/components/admin/report/ReportFilterBar';
import ReportGrid from '@/components/admin/report/ReportGridView';
import ReportTable from '@/components/admin/report/ReportTableView';
import PageHeader from '@/components/ui/page-header';
import ReportCreateModal from './ReportCreateModal';
import { HiOutlinePlus } from 'react-icons/hi';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [openModal, setOpenModal] = useState(false); // ✅ State untuk modal

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

  const filteredReports = reports.filter((report) => {
    const bupatiMatch =
      filterStatus === 'ALL' || report.bupatiStatus === filterStatus;
    const opdMatch =
      filterPriority === 'ALL' || report.opdStatus === filterPriority;
    return bupatiMatch && opdMatch;
  });

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
        <p className="text-gray-600 dark:text-gray-400">
          Tidak ada laporan dengan filter ini.
        </p>
      ) : viewMode === 'table' ? (
        <ReportTable reports={filteredReports} />
      ) : (
        <ReportGrid reports={filteredReports} />
      )}

      <ReportCreateModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
