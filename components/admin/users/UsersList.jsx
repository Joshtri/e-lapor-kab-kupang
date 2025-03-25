'use client';

import UserFilterBar from '@/components/admin/users/user-filter-bar';
import UserGrid from '@/components/admin/users/UserGridView';
import UserTable from '@/components/admin/users/UserTableView';
import CreateUserModal from '@/components/admin/users/users-create-modal';
import EmptyState from '@/components/ui/empty-state';
import PageHeader from '@/components/ui/page-header';
import { exportToExcel } from '@/utils/export/exportToExcel';
import axios from 'axios';
import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import { toast } from 'sonner';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // default ke tabel
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(''); // ✅ NEW


  const handleExportExcel = () => {
    const exportData = filteredUsers.map((user) => ({
      Nama: user.name,
      Username: user.username,
      Email: user.email,
      Role: user.role,
      Instansi: user.opd?.name || '-',
    }));
  
    exportToExcel({
      data: exportData,
      columns: [
        { header: 'Nama', key: 'Nama' },
        { header: 'Username', key: 'Username' },
        { header: 'Email', key: 'Email' },
        { header: 'Role', key: 'Role' },
        { header: 'Instansi', key: 'Instansi' },
      ],
      filename: 'data_users',
    });
  };

  useEffect(() => {
    fetchUsers();
    fetchIncompleteProfiles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Gagal mengambil data users:', error);
      toast.error('Gagal mengambil data users.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleResetFilter = () => {
    setFilterStatus('ALL');
    setFilterPriority('ALL');
    setSearchQuery('');
  };

  const filteredUsers = users.filter((user) => {
    const roleMatch = filterRole === 'ALL' || user.role === filterRole;
  
    const searchMatch = [
      user.name,
      user.email,
      user.username,
      user.role,
      user.opd?.name, // Jika relasi ada
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  
    return roleMatch && searchMatch;
  });
  
  const [incompleteOPDProfiles, setIncompleteOPDProfiles] = useState([]);

  const fetchIncompleteProfiles = async () => {
    try {
      const res = await axios.get('/api/opd/incompleted-users');
      // console.log('🧩 Incomplete OPD profiles:', res.data.incompleteUsers);
      setIncompleteOPDProfiles(res.data.incompleteUsers.map((u) => u.id));
    } catch (err) {
      console.error('Gagal cek incomplete OPD:', err);
    }
  };

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
        showBackButton={false}
        title="Manajemen Users"
        showSearch={true}
        onExportExcel={handleExportExcel}
        searchQuery={searchQuery} // ✅ terhubung
        onSearchChange={(val) => setSearchQuery(val)} // ✅ tambahkan ini
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },

          customRoutes: {
            adm: { label: 'Dashboard Admin', href: '/adm/dashboard' },
          },
        }}
      />
      <div className="flex justify-between items-center mb-6">
        <UserFilterBar
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <Button
          color="blue"
          onClick={() => setOpenModal(true)}
          icon={HiOutlinePlus}
        >
          Tambah User
        </Button>
      </div>

      {filteredUsers.length === 0 ? (
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
        <UserTable
          users={filteredUsers}
          incompleteProfiles={incompleteOPDProfiles}
          onSuccess={fetchUsers}
        />
      ) : (
        <UserGrid
          users={filteredUsers}
          onShow={(user) => console.log('Show', user)}
          onEdit={(user) => console.log('Edit', user)}
          onDelete={(user) => console.log('Delete', user)}
        />
      )}

      <CreateUserModal
        open={openModal}
        setOpen={setOpenModal}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
