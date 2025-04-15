'use client';

import axios from 'axios';
import { Button, Card, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineKey } from 'react-icons/hi';
import { toast } from 'sonner';
import ChangePasswordModal from './change-password';

const ProfileManagement = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      setUser(res.data?.user);
    } catch (error) {
      console.error('Gagal mengambil profil user:', error);
      toast.error('Gagal mengambil data profil.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Memuat data profil...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-6 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Profil Pengguna
        </h2>

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Nama Lengkap
          </span>
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.name}
          </p>
        </div>

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Email
          </span>
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.email}
          </p>
        </div>

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Nomor Kontak
          </span>
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.contactNumber || '-'}
          </p>
        </div>

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            NIK / NIP
          </span>
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.nikNumber || '-'}
          </p>
        </div>

        {/* <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.role}
          </p>
        </div> */}

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tanggal Daftar
          </span>
          <p className="font-medium text-gray-900 dark:text-white">
            {new Date(user?.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button color="blue" size="sm" onClick={() => setOpenModal(true)}>
            <HiOutlineKey className="w-4 h-4 mr-1" />
            Ubah Password
          </Button>
        </div>
      </Card>

      {/* Modal ubah password */}
      <ChangePasswordModal open={openModal} setOpen={setOpenModal} />
    </div>
  );
};

export default ProfileManagement;
