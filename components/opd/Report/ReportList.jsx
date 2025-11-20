'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Button } from 'flowbite-react';
import { toast } from 'sonner';
import ReportFilterBar from '@/components/opd/Report/ReportFilterBar';
import ReportGrid from '@/components/opd/Report/ReportGridView';
import ReportTable from '@/components/opd/Report/ReportTableView';
import PageHeader from '@/components/ui/PageHeader';
import { HiOutlinePlus } from 'react-icons/hi';
import EmptyState from '@/components/ui/EmptyState';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(''); // ✅ NEW
  const [openModal, setOpenModal] = useState(false);
  const [opdId, setOpdId] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      const user = res.data.user;
      setOpdId(user.opdId);
    } catch (error) {
      // ('Gagal mengambil data user login:', error);
      toast.error('Gagal mengambil data user login.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reports/opd');
      setReports(res.data);
    } catch (error) {
      // ('Gagal ambil laporan:', error);
      toast.error('Gagal mengambil data laporan.');
    } finally {
      setLoading(false);
    }
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
        onSearchChange={(val) => setSearchQuery(val)} // ✅ handler
        showRefreshButton
        onRefreshClick={() => fetchReports(opdId)}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/opd/dashboard' },
          customRoutes: {},
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
        <EmptyState message="Tidak ada laporan yang cocok dengan filter saat ini.">
          <p className="text-sm">
            Coba ubah filter status, prioritas, atau gunakan kata kunci yang
            berbeda.
          </p>
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        </EmptyState>
      ) : viewMode === 'table' ? (
        <ReportTable reports={filteredReports} />
      ) : (
        <ReportGrid reports={filteredReports} />
      )}
    </div>
  );
}
