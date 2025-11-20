'use client';

import Image from 'next/image';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import NotificationDropdown from '@/components/ui/NotificationDropdown';
import { getInitials } from '@/utils/common';
import axios from 'axios';
import { Avatar, Button, HR, Navbar } from 'flowbite-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import {
  HiMenu,
  HiOutlineDocumentReport,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineLogout,
  HiOutlineUserCircle,
  HiPaperAirplane,
  HiX,
} from 'react-icons/hi';
import { toast } from 'sonner';
import AboutModal from '../../pelapor/AboutModal';

const HeaderPelaporMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openAboutModal, setOpenAboutModal] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hasAvatarImage, setHasAvatarImage] = useState(true);

  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
      } catch (error) {
        console.error('Gagal mengambil informasi pengguna:', error);
      }
    };
    fetchUserInformation();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifRes = await axios.get('/api/notifications');
        setNotifications(
          notifRes.data.filter(
            (n) => typeof n.link === 'string' && n.link.startsWith('/pelapor/'),
          ),
        );
      } catch (err) {
        console.error('Gagal mengambil notifikasi:', err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', null, {
        withCredentials: true,
      });
      // await signOut({ redirect: false });
      toast.success('Berhasil logout! Mengarahkan ke halaman login...');

      router.push('/auth/login');
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error('Gagal logout. Silakan coba lagi.');
    }
  };

  const handleCreateReport = () => {
    if (pathname === '/pelapor/dashboard') {
      router.push('/pelapor/dashboard?openModal=true');
    } else {
      router.push('/pelapor/dashboard?openModal=true');
    }
    setIsMenuOpen(false);
  };

  const handleNotificationClick = async (notif) => {
    try {
      await axios.post('/api/notifications/read', { notificationId: notif.id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
      router.push(notif.link);
    } catch (err) {
      console.error('Gagal memperbarui notifikasi:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const menuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } },
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar
        fluid
        className="fixed w-full z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between w-full px-4">
          {/* Logo */}
          <Link href="/pelapor/dashboard" className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                ease: 'easeInOut',
              }}
            >
              <Image
                src="/fixed-logo-app.png"
                alt="Lapor Kaka Bupati Logo"
                width={40}
                height={40}
                priority
              />
            </motion.div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Lapor Kaka Bupati
            </h1>
          </Link>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                handleNotificationClick={handleNotificationClick}
                loadingNotifications={loadingNotifications}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <BsMoonStarsFill className="text-gray-700 dark:text-gray-300 text-lg" />
              ) : (
                <BsSunFill className="text-yellow-400 text-lg" />
              )}
            </button>

            {/* Menu Button */}
            <Button
              color="gray"
              size="sm"
              className="p-2"
              onClick={() => setIsMenuOpen(true)}
            >
              <HiMenu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Navbar>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 z-50 shadow-xl"
            >
              <div className="p-4 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Menu
                  </h2>
                  <Button
                    color="gray"
                    size="sm"
                    className="p-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HiX className="h-5 w-5" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-white dark:bg-gray-700">
                    {hasAvatarImage && user?.id ? (
                      <Image
                        src={`/api/avatar/${user?.id}`}
                        alt="Foto Profil"
                        width={64}
                        height={64}
                        unoptimized // 🧠 disables next/image optimization for this src
                        className="rounded-full object-cover w-full h-full"
                        onError={() => setHasAvatarImage(false)}
                      />
                    ) : (
                      <Avatar
                        size="md"
                        rounded
                        placeholderInitials={getInitials(user?.name)}
                        className="w-full h-full text-sm"
                      />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>

                {/* Navigation Menu */}
                <div className="space-y-2 flex-grow">
                  <Link
                    href="/pelapor/dashboard"
                    className="flex items-center p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HiOutlineHome className="mr-3 h-5 w-5" />
                    Beranda
                  </Link>

                  <Link
                    href="/pelapor/riwayat-pengaduan"
                    className="flex items-center p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HiOutlineDocumentReport className="mr-3 h-5 w-5" />
                    Riwayat Pengaduan
                  </Link>

                  <button
                    onClick={handleCreateReport}
                    className="flex items-center p-3 w-full text-left text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <HiPaperAirplane className="mr-3 h-5 w-5" />
                    Buat Pengaduan
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>

                  <Link
                    href="/pelapor/profile"
                    className="flex items-center p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HiOutlineUserCircle className="mr-3 h-5 w-5" />
                    Profil
                  </Link>

                  <Link
                    href="/pelapor/lapor-bug/create"
                    className="flex items-center p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HiOutlineInformationCircle className="mr-3 h-5 w-5" />
                    Laporkan Masalah
                  </Link>

                  <Link
                    href="/pelapor/lapor-bug"
                    className="flex items-center p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HiOutlineDocumentReport className="mr-3 h-5 w-5" />
                    Riwayat Laporan Masalah
                  </Link>

                  <HR />

                  {/* About App */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenAboutModal(true);
                    }}
                    className="flex items-center p-3 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <HiOutlineInformationCircle className="mr-3 h-5 w-5" />
                    Tentang Aplikasi
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenLogoutModal(true);
                    }}
                    className="flex items-center p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-auto transition-colors"
                  >
                    <HiOutlineLogout className="mr-3 h-5 w-5" />
                    Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <ConfirmationDialog
        isOpen={openLogoutModal}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin logout dari akun ini?"
        confirmText="Ya, Logout"
        cancelText="Batal"
        confirmColor="failure"
        onConfirm={handleLogout}
        onCancel={() => setOpenLogoutModal(false)}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={openAboutModal}
        onClose={() => setOpenAboutModal(false)}
      />
    </>
  );
};

export default HeaderPelaporMobile;
