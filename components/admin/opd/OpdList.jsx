'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Spinner } from 'flowbite-react';
import { HiOutlinePlus } from 'react-icons/hi';
import { toast } from 'sonner';
import OPDFilterBar from '@/components/admin/opd/opd-filter-bar';
import OPDGrid from '@/components/admin/opd/opd-grid-view';
import OPDTable from '@/components/admin/opd/opd-table-view';
import PageHeader from '@/components/ui/page-header';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/ui/empty-state';
import Pagination from '@/components/ui/Pagination';

export default function OPDList() {
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterWilayah, setFilterWilayah] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const router = useRouter();

  useEffect(() => {
    fetchOPD();
  }, []);

  const fetchOPD = async () => {
    try {
      const res = await axios.get('/api/opd/list');
      setOpdList(res.data);
    } catch (error) {
      console.error('Gagal mengambil data OPD:', error);
      toast.error('Gagal mengambil data OPD.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    setFilterWilayah('ALL');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleAddOPD = () => {
    router.push('/adm/org-perangkat-daerah/create');
  };

  const filteredOPD = opdList.filter((opd) => {
    const wilayahMatch =
      filterWilayah === 'ALL' || opd.wilayah === filterWilayah;

    const searchMatch = [opd.name, opd.email, opd.alamat, opd.website, opd.telp]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return wilayahMatch && searchMatch;
  });

  const paginatedOPD = filteredOPD.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      <PageHeader
        showBackButton={false}
        title="Manajemen OPD"
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },
          customRoutes: {
            adm: { label: 'Data', href: '#' },
          },
        }}
      />

      <div className="flex justify-between items-center mb-6">
        <OPDFilterBar
          filterWilayah={filterWilayah}
          setFilterWilayah={setFilterWilayah}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <Button
          color="blue"
          onClick={() => handleAddOPD(true)}
          icon={HiOutlinePlus}
        >
          Tambah OPD
        </Button>
      </div>

      {filteredOPD.length === 0 ? (
        <EmptyState message="Tidak ada data OPD yang cocok dengan filter saat ini.">
          <p className="text-sm">
            Coba ubah filter atau gunakan kata kunci lain.
          </p>
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        </EmptyState>
      ) : (
        <>
          {viewMode === 'table' ? (
            <OPDTable opdList={paginatedOPD} />
          ) : (
            <OPDGrid opdList={paginatedOPD} />
          )}

          <Pagination
            totalItems={filteredOPD.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
