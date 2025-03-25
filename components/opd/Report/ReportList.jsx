'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Modal, Button } from 'flowbite-react';
import { toast } from 'sonner';
import ReportFilterBar from '@/components/opd/report/ReportFilterBar';
import ReportGrid from '@/components/opd/report/ReportGridView';
import ReportTable from '@/components/opd/report/ReportTableView';
import PageHeader from '@/components/ui/page-header';
import ReportCreateModal from './ReportCreateModal';
import { HiOutlinePlus } from 'react-icons/hi';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [openModal, setOpenModal] = useState(false);
  const [opdId, setOpdId] = useState(null); // ✅

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      const user = res.data.user;
      setOpdId(user.opdId); // ✅ ambil dari dalam `user`
    } catch (error) {
      console.error('Gagal mengambil data user login:', error);
      toast.error('Gagal mengambil data user login.');
    }
  };
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reports/opd'); // ✅ ga perlu query param
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
        onRefreshClick={() => fetchReports(opdId)}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/opd/dashboard' },
          customRoutes: {
            opd: { label: 'Dashboard OPD', href: '/opd/dashboard' },
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
          onCreateClick={() => setOpenModal(true)}
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

      {/* <ReportCreateModal openModal={openModal} setOpenModal={setOpenModal} /> */}
    </div>
  );
}
