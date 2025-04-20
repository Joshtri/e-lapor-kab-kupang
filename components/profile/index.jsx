'use client';

import axios from 'axios';
import { Button, Card, Spinner, Badge, Avatar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineKey,
  HiOfficeBuilding,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlineGlobe,
  HiOutlineLocationMarker,
  HiOfficeBuilding as HiOutlineOfficeBuilding,
  HiOutlinePencilAlt,
} from 'react-icons/hi';
import { toast } from 'sonner';
import ChangePasswordModal from './ChangePasswordProfile';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { getRoleColor } from '@/utils/roleColor';

const ProfileManagement = () => {
  const [user, setUser] = useState(null);
  const [opd, setOpd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      setUser(res.data?.user);

      // Jika user memiliki role OPD, ambil data OPD
      if (res.data?.user?.role === 'OPD') {
        setOpd(res.data?.opd);
      }
    } catch (error) {
      console.error('Gagal mengambil profil user:', error);
      toast.error('Gagal mengambil data profil.');
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <Spinner size="xl" className="mb-4" />
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            Memuat data profil...
          </span>
        </motion.div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

 

  const handleSaveProfile = async (updatedData) => {
    try {
      const res = await axios.patch('/api/auth/update', updatedData);
      setUser(res.data.user);
      toast.success('Profil berhasil diperbarui!');
    } catch (error) {
      toast.error('❌ Gagal memperbarui profil.');
      console.error(error);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full max-w-4xl mx-auto p-4 space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Manajemen Profil
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Kelola informasi profil dan akun Anda
        </p>
      </motion.div>

      {/* Card Profil Pengguna */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="relative bg-gradient-to-r from-blue-500 to-cyan-400 p-4 sm:p-6 pb-16 sm:pb-24 dark:from-blue-700 dark:to-cyan-600">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Profil Pengguna
              </h2>
              {user?.role && (
                <Badge
                  color={getRoleColor(user.role)}
                  size="sm"
                  className="font-medium"
                >
                  {user.role}
                </Badge>
              )}
            </div>
          </div>

          <div className="relative px-4 sm:px-6 pb-6">
            <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-0">
              <div className="bg-white dark:bg-gray-700 p-1 rounded-full shadow-lg">
                <Avatar
                  size="md"
                  rounded
                  placeholderInitials={getInitials(user?.name)}
                  className="ring-4 ring-white dark:ring-gray-700 bg-blue-100 dark:bg-blue-900"
                />
              </div>
              <div className="sm:ml-4 sm:mb-2">
                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white break-words">
                  {user?.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Bergabung sejak{' '}
                  {new Date(user?.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0">
                  <HiOutlineMail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </span>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                    {user?.email}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full flex-shrink-0">
                  <HiOutlinePhone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nomor Kontak
                  </span>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                    {user?.contactNumber || '-'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full flex-shrink-0">
                  <HiOutlineIdentification className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    NIK / NIP
                  </span>
                  {/* <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                    {user?.nikNumber || '-'}
                  </p> */}
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                    {user?.nikMasked}
                  </p>{' '}

                  
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full flex-shrink-0">
                  <HiOutlineCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tanggal Daftar
                  </span>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                    {new Date(user?.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-end mt-4 sm:mt-6">
              <motion.div whileTap={{ scale: 0.95 }} className="flex gap-2">
                <Button
                  gradientDuoTone="cyanToBlue"
                  size="sm"
                  onClick={() => setOpenModal(true)}
                  className="font-medium"
                >
                  <HiOutlineKey className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Ubah Password
                </Button>
                <Button
                  outline
                  size="sm"
                  className="font-medium"
                  onClick={() => setOpenEditModal(true)}
                >
                  <HiOutlinePencilAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Ubah Profile
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Card Profil OPD (hanya untuk role OPD) */}
      {user?.role === 'OPD' && opd && (
        <motion.div variants={item}>
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="relative bg-gradient-to-r from-purple-500 to-indigo-500 p-4 sm:p-6 pb-12 sm:pb-16 dark:from-purple-700 dark:to-indigo-700">
              <div className="flex items-center gap-2">
                <HiOfficeBuilding className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Profil OPD
                </h2>
              </div>
            </div>

            <div className="relative px-4 sm:px-6 pb-6">
              <div className="absolute -top-8 sm:-top-10 left-4 right-4 sm:left-6 sm:right-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 break-words">
                    {opd?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center flex-wrap">
                    <HiOutlineOfficeBuilding className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-500 dark:text-purple-400" />
                    Organisasi Perangkat Daerah
                  </p>
                </div>
              </div>

              <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full flex-shrink-0">
                    <HiOutlineLocationMarker className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                      Alamat
                    </span>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                      {opd?.alamat || '-'}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-full flex-shrink-0">
                    <HiOutlineMail className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email Instansi
                    </span>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                      {opd?.email || '-'}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-full flex-shrink-0">
                    <HiOutlinePhone className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                      Telepon
                    </span>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                      {opd?.telp || '-'}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full flex-shrink-0">
                    <HiOutlineGlobe className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                      Website
                    </span>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      {opd?.website ? (
                        <a
                          href={
                            opd.website.startsWith('http')
                              ? opd.website
                              : `https://${opd.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400 flex items-center flex-wrap"
                        >
                          <span className="break-words">{opd.website}</span>
                          <svg
                            className="w-3 h-3 ml-1 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            ></path>
                          </svg>
                        </a>
                      ) : (
                        '-'
                      )}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Modal ubah password */}
      <ChangePasswordModal open={openModal} setOpen={setOpenModal} />
      <EditProfileModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        user={user}
        onSave={handleSaveProfile}
      />
    </motion.div>
  );
};

export default ProfileManagement;
