'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from 'flowbite-react';
import {
  HiOutlinePlus,
  HiOutlineEye,
  HiPencilAlt,
  HiTrash,
  HiOfficeBuilding,
  HiExclamationCircle,
} from 'react-icons/hi';

import ListGrid from '@/components/ui/data-view/ListGrid';
import DataCard from '@/components/ui/data-view/DataCard';
import GridDataList from '@/components/ui/data-view/GridDataList';
import ActionsButton from '@/components/ui/ActionsButton';
import UserCreateModal from '@/components/admin/users/users-create-modal';
import UserEditModal from '@/components/admin/users/UserEditModal';
import { exportToExcel } from '@/utils/export/exportToExcel';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incompleteProfiles, setIncompleteProfiles] = useState([]); // ⚠️

  const [viewMode, setViewMode] = useState('table');
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchIncompleteProfiles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil data user.');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncompleteProfiles = async () => {
    try {
      const { data } = await axios.get('/api/opd/incompleted-users');
      // misal data.incompleteUsers memberikan array user.id
      setIncompleteProfiles(data.incompleteUsers.map((u) => u.id));
    } catch {
      console.error('Gagal load incompleteProfiles');
    }
  };

  const handleExport = () => {
    const rows = filtered.slice().map((u) => ({
      Nama: u.name,
      Email: u.email,
      Role: u.role,
      Instansi: u.opd?.name || '-',
    }));
    exportToExcel({
      data: rows,
      columns: [
        { header: 'Nama', key: 'Nama' },
        { header: 'Email', key: 'Email' },
        { header: 'Role', key: 'Role' },
        { header: 'Instansi', key: 'Instansi' },
      ],
      filename: 'data_users',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus user ini?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      toast.success('User dihapus.');
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus user.');
    }
  };

  // filters & search
  // filter + search
  const filtered = users.filter((u) => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const text = [u.name, u.email, u.role, u.opd?.name].join(' ').toLowerCase();
    return matchRole && text.includes(searchQuery.toLowerCase());
  });

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const columns = [
    {
      header: 'Nama',
      accessor: 'name',
      width: 'w-1/3',
      cell: (user) => {
        const isIncomplete = incompleteProfiles.includes(user.id);
        return (
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>

            {user.role === 'OPD' && user.opd?.name && (
              <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                <HiOfficeBuilding className="inline h-4 w-4" />
                {user.opd.name}
              </span>
            )}

            {isIncomplete && (
              <span className="text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
                <HiExclamationCircle className="inline h-4 w-4" />
                Profil instansi OPD belum lengkap
              </span>
            )}
          </div>
        );
      },
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Instansi', accessor: 'opd.name' },
  ];

  const actionButtons = [
    (u) => (
      <ActionsButton
        key="view"
        icon={HiOutlineEye}
        tooltip="Detail"
        color="gray"
        onClick={() => (window.location.href = `/adm/users/${u.id}`)}
      />
    ),
    (u) => (
      <ActionsButton
        key="edit"
        icon={HiPencilAlt}
        tooltip="Edit"
        color="blue"
        onClick={() => {
          setSelectedUser(u);
          setOpenEdit(true);
        }}
      />
    ),
    (u) => (
      <ActionsButton
        key="del"
        icon={HiTrash}
        tooltip="Hapus"
        color="red"
        onClick={() => handleDelete(u.id)}
      />
    ),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-full mx-auto space-y-6"
    >
      <ListGrid
        // header
        title="Manajemen Users"
        showBackButton={false}
        searchBar={true}
        showSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        onExportExcel={handleExport}
        showRefreshButton
        onRefreshClick={fetchUsers}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },
          customRoutes: {
            adm: { label: 'Dashboard Admin', href: '/adm/dashboard' },
          },
        }}
        // filter & view controls
        viewMode={viewMode}
        setViewMode={setViewMode}
        filtersComponent={
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                className="w-full p-2 border rounded"
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">Semua Role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="OPD">OPD</option>
                <option value="PELAPOR">PELAPOR</option>
                <option value="BUPATI">BUPATI</option>
              </select>
            </div>
            <Button
              color="gray"
              className="w-full"
              onClick={() => {
                setFilterRole('ALL');
                setSearchQuery('');
              }}
            >
              Reset Filter
            </Button>
          </div>
        }
        showCreateButton
        createButtonLabel="Tambah User"
        onCreate={() => setOpenCreate(true)}
        // data
        data={paginated}
        columns={columns}
        actionButtons={actionButtons}
        gridComponent={
          <GridDataList
            data={paginated}
            renderItem={(u) => (
              <DataCard
                avatar={u.name}
                title={u.name}
                subtitle={u.role}
                meta={u.email}
                badges={u.opd ? [{ label: u.opd.name, color: 'blue' }] : []}
              />
            )}
          />
        }
        loading={loading}
        emptyMessage="Tidak ada user ditemukan."
        emptyAction={
          <Button
            color="gray"
            onClick={() => {
              setFilterRole('ALL');
              setSearchQuery('');
              setCurrentPage(1);
            }}
          >
            Reset Filter
          </Button>
        }
        // pagination
        paginationProps={{
          totalItems: filtered.length,
          currentPage,
          pageSize,
          onPageChange: setCurrentPage,
        }}
      />

      <UserCreateModal
        open={openCreate}
        setOpen={setOpenCreate}
        onSuccess={() => {
          setOpenCreate(false);
          fetchUsers();
        }}
      />

      {selectedUser && (
        <UserEditModal
          open={openEdit}
          setOpen={setOpenEdit}
          user={selectedUser}
          onSuccess={() => {
            setOpenEdit(false);
            fetchUsers();
          }}
        />
      )}
    </motion.div>
  );
}
