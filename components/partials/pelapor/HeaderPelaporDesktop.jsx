'use client';

import Image from 'next/image';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import NotificationDropdown from '@/components/ui/NotificationDropdown';
import { getInitials } from '@/utils/common';
import axios from 'axios';
import { Avatar, Button, Dropdown } from 'flowbite-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import {
  HiMailOpen,
  HiOutlineDocumentReport,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineUserCircle,
  HiPaperAirplane,
} from 'react-icons/hi';
import { toast } from 'sonner';

const HeaderPelaporDesktop = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [hasAvatarImage, setHasAvatarImage] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);

        const notifRes = await axios.get('/api/notifications');
        setNotifications(
          notifRes.data.filter(
            (n) => typeof n.link === 'string' && n.link.startsWith('/pelapor/'),
          ),
        );
      } catch (err) {
        // ('Gagal mengambil data:', err);
      } finally {
        setLoadingUser(false);
        setLoadingNotifications(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', null, {
        withCredentials: true,
      });
      toast.success('Berhasil logout! Mengarahkan ke halaman login...');

      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (error) {
      // ('Logout Error:', error);
      toast.error('Gagal logout. Silakan coba lagi.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notif) => {
    try {
      await axios.post('/api/notifications/read', { notificationId: notif.id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
      router.push(notif.link);
    } catch (err) {
      // ('Gagal memperbarui notifikasi:', err);
    }
  };

  const handleCreateReport = () => {
    // If already on dashboard, we'll rely on URL params to trigger the modal
    if (pathname === '/pelapor/dashboard') {
      // Use URL with search params to trigger modal
      router.push('/pelapor/dashboard?openModal=true');
    } else {
      // Navigate to dashboard with param to open modal
      router.push('/pelapor/dashboard?openModal=true');
    }
  };

  return (
    <>
      <header className="fixed w-full z-20 top-0 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
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
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Lapor Kaka Bupati
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Layanan Pengaduan Online
              </p>
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/pelapor/dashboard"
              className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <HiOutlineHome className="h-4 w-4" />
              <span>Beranda</span>
            </Link>
            <Link
              href="/pelapor/riwayat-pengaduan"
              className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <HiOutlineDocumentReport className="h-4 w-4" />
              <span>Riwayat Pengaduan</span>
            </Link>
            <Button
              onClick={handleCreateReport}
              className="flex items-center gap-1 px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <HiPaperAirplane className="h-4 w-4" />
              <span>Buat Pengaduan</span>
            </Button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
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

            {/* User Avatar & Dropdown */}
            <div className="relative">
              <Dropdown
                arrowIcon={false}
                inline
                className="w-64"
                label={
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white dark:bg-gray-700">
                    {hasAvatarImage && user?.id ? (
                      <img
                        src={`/api/avatar/${user.id}`}
                        alt="User Avatar"
                        className="object-cover w-full h-full hover:scale-110 transition-all duration-300 rounded-full"
                        onError={() => setHasAvatarImage(false)}
                      />
                    ) : (
                      <Avatar
                        size="sm"
                        rounded
                        placeholderInitials={getInitials(user?.name)}
                        className="w-full h-full text-sm"
                      />
                    )}
                  </div>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {user?.name || 'User'}
                  </span>
                  <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                    {user?.email || 'user@email.com'}
                  </span>
                </Dropdown.Header>
                {/* <Dropdown.Divider /> */}
                <Dropdown.Item
                  icon={HiOutlineUserCircle}
                  onClick={() => router.push('/pelapor/profile')}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Item
                  icon={HiMailOpen}
                  onClick={() => router.push('/pelapor/riwayat-pengaduan')}
                >
                  Riwayat Pengaduan
                </Dropdown.Item>
                <Dropdown.Item
                  icon={HiMailOpen}
                  onClick={() => router.push('/pelapor/lapor-bug/create')}
                >
                  Laporkan Masalah
                </Dropdown.Item>
                <Dropdown.Item
                  icon={HiMailOpen}
                  onClick={() => router.push('/pelapor/lapor-bug')}
                >
                  Riwayat Laporan Masalah
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item
                  icon={HiOutlineLogout}
                  onClick={() => setOpenModal(true)}
                  className="text-red-600 dark:text-red-400"
                >
                  Logout
                </Dropdown.Item>
              </Dropdown>
            </div>

            {/* Toggle Menu Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <HiOutlineMenuAlt2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden px-4 pb-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <Link
                href="/pelapor/dashboard"
                className="flex items-center gap-2 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineHome className="h-5 w-5" />
                <span>Beranda</span>
              </Link>
              <Link
                href="/pelapor/riwayat-pengaduan"
                className="flex items-center gap-2 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineDocumentReport className="h-5 w-5" />
                <span>Riwayat Pengaduan</span>
              </Link>
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  handleCreateReport();
                }}
                className="flex items-center gap-2 mt-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors w-full"
              >
                <HiPaperAirplane className="h-5 w-5" />
                <span>Buat Pengaduan</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modal Logout */}
      <ConfirmationDialog
        isOpen={openModal}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin logout dari akun ini?"
        confirmText="Ya, Logout"
        cancelText="Batal"
        confirmColor="failure"
        onConfirm={handleLogout}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
};

export default HeaderPelaporDesktop;
