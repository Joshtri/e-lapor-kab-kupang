'use client';

import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Avatar } from 'flowbite-react';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { useTheme } from 'next-themes';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import NotificationDropdown from '@/components/ui/notification-dropdown';

const HeaderPelapor = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);

        const notifRes = await axios.get('/api/notifications');
        setNotifications(
          notifRes.data.filter((n) => n.link.startsWith('/pelapor/')),
        );
      } catch (err) {
        console.error('Gagal mengambil data:', err);
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
        withCredentials: true, // ✅ Penting kalau axios global butuh kirim cookie
      });
      toast.success('Berhasil logout! Mengarahkan ke halaman utama...');

      setTimeout(() => {
        router.push('/auth/login'); // ✅ Lebih baik langsung ke login, bukan ke "/" kalau ini logout user
      }, 1500); // Sedikit lebih cepat, biar UX makin smooth
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error('Gagal logout. Silakan coba lagi.');
    }
  };

  return (
    <>
      <header className="fixed w-full z-20 top-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-between py-3 px-4 md:px-6">
          {/* Logo */}
          <Link href="/pelapor/dashboard" className="flex items-center">
            <HiOutlineChatAlt2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            <span className="ml-2 text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
              Lapor KK Bupati
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/pelapor/dashboard"
              className="text-gray-800 dark:text-gray-200 hover:text-green-500"
            >
              Beranda
            </Link>
            <Link
              href="/pelapor/log-laporan"
              className="text-gray-800 dark:text-gray-200 hover:text-green-500"
            >
              Log Laporan
            </Link>
          </nav>

          {/* Kanan */}
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationDropdown
              notifications={notifications}
              unreadCount={notifications.filter((n) => !n.isRead).length}
              handleNotificationClick={(notif) => {
                axios
                  .post('/api/notifications/read', { notificationId: notif.id })
                  .then(() => {
                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === notif.id ? { ...n, isRead: true } : n,
                      ),
                    );
                    router.push(notif.link);
                  })
                  .catch((err) => {
                    console.error('Gagal update notifikasi:', err);
                  });
              }}
              loadingNotifications={loadingNotifications}
            />
            {/* Dark Mode */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <BsMoonStarsFill className="text-gray-700 dark:text-gray-300 text-lg" />
              ) : (
                <BsSunFill className="text-yellow-400 text-lg" />
              )}
            </button>

            {/* Logout Desktop */}
            {/* <Button
              color="failure"
              onClick={() => setOpenModal(true)}
              size="sm"
              className="font-medium hidden md:flex"
            >
              Logout
            </Button> */}

            {/* Avatar & Dropdown */}
            <Dropdown
              inline
              label={
                <Avatar
                  alt="User Avatar"
                  img={`https://ui-avatars.com/api/?name=${user?.name}`}
                  rounded
                  size="sm"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium">{user?.name}</span>
                <span className="block truncate text-sm">{user?.email}</span>
              </Dropdown.Header>
              <Dropdown.Divider />
              {/* <Dropdown.Item
                icon={HiOutlineUserCircle}
                className=''
                // onClick={() => router.push('/pelapor/profile')}
              >
                Profil Saya
              </Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item
                icon={HiOutlineLogout}
                onClick={() => setOpenModal(true)}
                className="text-red-600"
              >
                Logout
              </Dropdown.Item>
            </Dropdown>

            {/* Toggle Menu Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              <span className="sr-only">Open Menu</span>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4">
            <Link
              href="/pelapor/dashboard"
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500"
            >
              Beranda
            </Link>
            <Link
              href="/pelapor/log-laporan"
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500"
            >
              Log Laporan
            </Link>
            <Button
              color="failure"
              onClick={() => setOpenModal(true)}
              className="w-full mt-2"
            >
              Logout
            </Button>
          </div>
        )}
      </header>

      {/* Modal Logout */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
        <Modal.Header>Konfirmasi Logout</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 dark:text-gray-300">
            Apakah Anda yakin ingin logout dari akun ini?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleLogout}>
            Ya, Logout
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HeaderPelapor;
