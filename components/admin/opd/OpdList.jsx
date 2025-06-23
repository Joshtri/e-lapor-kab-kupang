'use client';

import { useEffect, useState } from 'react';
import { Button, Spinner, Modal } from 'flowbite-react';
import {
  HiOutlinePlus,
  HiOutlineOfficeBuilding,
  HiOutlineEye,
  HiOutlineTrash,
  HiExclamation,
} from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import ListGrid from '@/components/ui/data-view/ListGrid';
import GridDataList from '@/components/ui/data-view/GridDataList';
import DataCard from '@/components/ui/data-view/DataCard';
import { truncateText } from '@/utils/common';
import TruncatedWithTooltip from '@/components/ui/TruncatedWithTooltip';
import ActionsButton from '@/components/ui/ActionsButton';
import { MdEdit } from 'react-icons/md';

export default function OPDList() {
  const [opds, setOpds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [filterWilayah, setFilterWilayah] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opdToDelete, setOpdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 10;

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

  const handleDeleteClick = (opd) => {
    setOpdToDelete(opd);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!opdToDelete) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/opd/${opdToDelete.id}`);
      setOpds(opds.filter(opd => opd.id !== opdToDelete.id));
      toast.success(`OPD "${opdToDelete.name}" berhasil dihapus`);
      setDeleteModalOpen(false);
      setOpdToDelete(null);
    } catch (error) {
      console.error('Error deleting OPD:', error);
      if (error.response?.data?.error === 'OPD_HAS_REPORTS') {
        toast.error('OPD ini memiliki laporan terkait dan tidak dapat dihapus');
      } else {
        toast.error('Gagal menghapus OPD');
      }
    } finally {
      setIsDeleting(false);
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

  const actionsButton = [
    (r) => (
      <ActionsButton
        icon={HiOutlineEye}
        tooltip={`Lihat detail ${r.name}`}
        color="gray"
        onClick={() => router.push(`/adm/org-perangkat-daerah/${r.id}`)}
      />
    ),

    (r) => (
      <ActionsButton
        icon={MdEdit}
        tooltip={`Edit OPD ${r.name}`}
        color="blue"
        onClick={() => router.push(`/adm/org-perangkat-daerah/${r.id}/edit`)}
      />
    ),
    
    (r) => (
      <ActionsButton
        icon={HiOutlineTrash}
        tooltip={`Hapus OPD ${r.name}`}
        color="red"
        onClick={() => handleDeleteClick(r)}
        // disabled={r.reports?.length > 0}
      />
    ),
  ];

  return (
    <>
      <div className="p-4 space-y-6">
        <ListGrid
          breadcrumbsProps={{
            home: { label: 'Beranda', href: '/adm/dashboard' },
            customRoutes: {
              adm: {
                label: 'Dashboard Admin',
                href: '/adm/dashboard',
              },
              'org-perangkat-daerah': {
                label: 'Organisasi Perangkat Daerah',
                href: '/adm/org-perangkat-daerah',
              },
            },
          }}
          title="Daftar OPD"
          showBackButton={false}
          searchBar
          searchQuery={searchQuery}
          actionButtons={actionsButton}
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

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteModalOpen}
        size="md"
        onClose={() => setDeleteModalOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiExclamation className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Apakah Anda yakin ingin menghapus OPD
              <span className="font-bold block text-gray-800">
                {opdToDelete?.name}
              </span>?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus OPD'}
              </Button>
              <Button
                color="gray"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Batal
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}