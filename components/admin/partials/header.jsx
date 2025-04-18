'use client';

import { useEffect, useState } from 'react';
import { Navbar, Button, Modal, Dropdown, Avatar } from 'flowbite-react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import {
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineUserCircle,
} from 'react-icons/hi';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import NotificationDropdown from '@/components/ui/NotificationDropdown';
import { motion } from 'framer-motion';
import LogoutConfirmationModal from '@/components/common/LogoutConfirmationModal';

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Gagal mengambil data user:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        if (response.status === 200) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Gagal mengambil notifikasi:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchUser();
    fetchNotifications();
  }, []);

  // Filter notifications for admin
  const filteredNotifications = notifications.filter(
    (notif) => typeof notif.link === 'string' && notif.link.startsWith('/adm/'),
  );

  const unreadCount = filteredNotifications.filter(
    (notif) => !notif.isRead,
  ).length;

  const handleNotificationClick = async (notif) => {
    try {
      await axios.post('/api/notifications/read', { notificationId: notif.id });
      router.push(notif.link);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error('Gagal memperbarui notifikasi:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', null, {
        withCredentials: true,
      });
      toast.success('Berhasil logout! Mengarahkan ke halaman utama...');

      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error('Gagal logout. Silakan coba lagi.');
    }
  };

  return (
    <Navbar
      fluid
      rounded
      className="py-2 px-6 bg-white dark:bg-gray-800 shadow-md fixed w-full z-40 top-0 left-0 transition-all duration-300 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center w-full">
        {/* Left: Menu & Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-300 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-all"
          >
            <HiOutlineMenu className="h-6 w-6" />
          </button>

          <div className="flex items-center">
            <motion.div
              className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 5,
                ease: 'easeInOut',
              }}
            >
              <HiOutlineMail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Admin Mail
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage all reports
              </p>
            </div>
          </div>
        </div>

        {/* Right: Notifications, Theme Toggle, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <NotificationDropdown
              notifications={filteredNotifications}
              unreadCount={unreadCount}
              handleNotificationClick={handleNotificationClick}
              loadingNotifications={loadingNotifications}
            />
          </div>

          {/* User Card */}
          <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-800/30">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
                className="p-2 rounded-full bg-white dark:bg-gray-700 transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
                aria-label="Toggle Dark Mode"
              >
                {resolvedTheme === 'dark' ? (
                  <BsSunFill className="text-yellow-400 text-lg" />
                ) : (
                  <BsMoonStarsFill className="text-gray-700 dark:text-gray-300 text-lg" />
                )}
              </button>
            )}

            {/* User Info */}
            <div className="hidden md:block">
              {loadingUser ? (
                <div className="space-y-1">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || 'Administrator'}
                  </p>
                </div>
              )}
            </div>

            {/* Avatar & Dropdown */}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="relative">
                  <Avatar
                    alt="User Avatar"
                    img={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`}
                    rounded
                    size="sm"
                    className="  dark:border-blue-800 hover:scale-110 transition-all duration-300"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {unreadCount}
                    </span>
                  )}
                </div>
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.name || 'Admin'}
                </span>
                <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || 'admin@email.com'}
                </span>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={HiOutlineUserCircle}
                onClick={() => router.push('/adm/profile')}
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                icon={HiMailOpen}
                onClick={() => router.push('/adm/dashboard')}
              >
                Inbox
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
        </div>
      </div>

      {/* Modal Logout */}
      {/* Modal Logout */}
      <LogoutConfirmationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleLogout}
      />
    </Navbar>
  );
};

export default AdminHeader;
