'use client';

import { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { HiOutlinePlus, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import ListGrid from '@/components/ui/data-view/ListGrid';
import GridDataList from '@/components/ui/data-view/GridDataList';
import DataCard from '@/components/ui/data-view/DataCard';
import { truncateText } from '@/utils/common';
import TruncatedWithTooltip from '@/components/ui/TruncatedWithTooltip';

export default function OPDList() {
  const [opds, setOpds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterWilayah, setFilterWilayah] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const router = useRouter();

  useEffect(() => {
    fetchOpds();
  }, []);

  const fetchOpds = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/opd/list');
      setOpds(data);
    } catch (err) {
      toast.error('Gagal memuat data OPD');
    } finally {
      setLoading(false);
    }
  };

  const filteredOpds = opds.filter((opd) => {
    const wilayahMatch =
      filterWilayah === 'ALL' || opd.wilayah === filterWilayah;
    const searchMatch = [opd.name, opd.email, opd.website, opd.alamat, opd.telp]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return wilayahMatch && searchMatch;
  });

  const paginatedOpds = filteredOpds.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleResetFilter = () => {
    setFilterWilayah('ALL');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const columns = [
    {
      header: 'Nama OPD',
      accessor: 'name',
      cell: (opd) => <TruncatedWithTooltip text={opd.name} length={25} />,
    },
    {
      header: 'Staff PJ',
      accessor: 'staff.name',
      cell: (opd) => opd.staff?.name || '-',
    },
    {
      header: 'Jumlah Laporan',
      accessor: 'reports',
      cell: (opd) => opd.reports?.length ?? 0,
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Wilayah',
      accessor: 'wilayah',
    },
    {
      header: 'Alamat',
      accessor: 'alamat',
      cell: (opd) => truncateText(opd.alamat, 40),
    },
    {
      header: 'Telepon',
      accessor: 'telp',
    },
    {
      header: 'Website',
      accessor: 'website',
    },
  ];

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

  return (
    <div className="p-4 space-y-6">
      <ListGrid
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },
          customRoutes: {
            'adm': {
              label: 'Dashboard Admin',
              href: '/adm/dashboard',
            },
            'org-perangkat-daerah': {
              label: 'Organisasi Perangkat Daerah',
              href: '/adm/org-perangkat-daerah',
            }
          },
        }}
        title="Daftar OPD"
        showBackButton={false}
        searchBar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={columns}
        data={paginatedOpds}
        loading={loading}
        gridComponent={
          <GridDataList
            data={paginatedOpds}
            renderItem={(opd) => (
              <DataCard
                avatar={opd.name}
                title={opd.name}
                subtitle={opd.staff?.name || '–'}
                meta={opd.wilayah}
                badges={[
                  {
                    label: `Laporan: ${opd.reports?.length ?? 0}`,
                    color: 'blue',
                  },
                  { label: opd.telp, color: 'gray' },
                ]}
                icon={HiOutlineOfficeBuilding}
              />
            )}
          />
        }
        showCreateButton
        createButtonLabel="Tambah OPD"
        onCreate={() => router.push('/adm/org-perangkat-daerah/create')}
        filtersComponent={
          <div className="space-y-3">
            <select
              className="w-full p-2 border rounded"
              value={filterWilayah}
              onChange={(e) => {
                setFilterWilayah(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">Semua Wilayah</option>
              <option value="AMARASI">Amarasi</option>
              <option value="FATULEU">Fatuleu</option>
              <option value="SOUTH_CENTRAL">South Central</option>
            </select>
            <Button color="gray" onClick={handleResetFilter}>
              Reset Filter
            </Button>
          </div>
        }
        paginationProps={{
          totalItems: filteredOpds.length,
          currentPage,
          pageSize,
          onPageChange: setCurrentPage,
        }}
        emptyMessage="Tidak ada OPD ditemukan"
        emptyAction={
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        }
      />
    </div>
  );
}
