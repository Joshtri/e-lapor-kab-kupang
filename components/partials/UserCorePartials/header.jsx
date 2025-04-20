// components/common/Header.jsx
'use client';

import { useEffect, useState } from 'react';
import { Navbar, Button, Dropdown, Avatar } from 'flowbite-react';
import {
  HiOutlineMenu,
  HiOutlineMail,
  HiOutlineUserCircle,
  HiMailOpen,
  HiOutlineLogout,
} from 'react-icons/hi';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import NotificationDropdown from '@/components/ui/NotificationDropdown';
import LogoutConfirmationModal from '@/components/common/LogoutConfirmationModal';

const ROLE_CONFIG = {
  admin: {
    title: 'Admin Mail',
    subtitle: 'Manage all reports',
    accentBg: 'bg-blue-100 dark:bg-blue-900/30',
    accentText: 'text-blue-600 dark:text-blue-400',
    notificationPrefix: '/adm/',
    profileRoute: '/adm/profile',
    inboxRoute: '/adm/dashboard',
    logoutMsg: 'Berhasil logout!',
  },
  opd: {
    title: 'OPD Mail',
    subtitle: 'Your OPD dashboard',
    accentBg: 'bg-purple-100 dark:bg-purple-900/30',
    accentText: 'text-purple-600 dark:text-purple-400',
    notificationPrefix: '/opd/',
    profileRoute: '/opd/profile',
    inboxRoute: '/opd/dashboard',
    logoutMsg: 'Berhasil logout! Mengarahkan ke halaman utama...',
  },
  bupati: {
    title: 'Bupati Mail',
    subtitle: 'Official correspondence',
    accentBg: 'bg-green-100 dark:bg-green-900/30',
    accentText: 'text-green-600 dark:text-green-400',
    notificationPrefix: '/bupati-portal/',
    profileRoute: '/bupati-portal/profile',
    inboxRoute: '/bupati-portal/dashboard',
    logoutMsg: 'Berhasil logout! Mengarahkan ke halaman utama...',
  },
};

export default function Header({
  role = 'admin',
  toggleSidebar,
  isSidebarOpen,
}) {
  const cfg = ROLE_CONFIG[role];
  const { theme, resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [openLogout, setOpenLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data, status } = await axios.get('/api/auth/me');
        if (status === 200) setUser(data.user);
      } catch (e) {
        // ('fetch user error', e);
      } finally {
        setLoadingUser(false);
      }
    };
    const fetchNotifs = async () => {
      try {
        const { data, status } = await axios.get('/api/notifications');
        if (status === 200) setNotifications(data);
      } catch (e) {
        // ('fetch notifications error', e);
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchMe();
    fetchNotifs();
  }, []);

  const filtered = notifications.filter(
    (n) =>
      typeof n.link === 'string' && n.link.startsWith(cfg.notificationPrefix),
  );
  const unreadCount = filtered.filter((n) => !n.isRead).length;

  const handleNotifClick = async (n) => {
    try {
      await axios.post('/api/notifications/read', { notificationId: n.id });
      router.push(n.link);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
    } catch (e) {
      // (e);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await axios.post('/api/auth/logout', null, { withCredentials: true });
      toast.success(cfg.logoutMsg);
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (e) {
      // (e);
      toast.error('Gagal logout. Silakan coba lagi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Navbar
      fluid
      rounded
      className="py-2 px-6 bg-white dark:bg-gray-800 shadow-md fixed w-full z-40 top-0 left-0 transition-all duration-300 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center w-full">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full"
          >
            <HiOutlineMenu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <motion.div
              className={`${cfg.accentBg} p-2 rounded-full mr-3`}
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            >
              <HiOutlineMail className={`h-6 w-6 ${cfg.accentText}`} />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {cfg.title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {cfg.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          <NotificationDropdown
            notifications={filtered}
            unreadCount={unreadCount}
            handleNotificationClick={handleNotifClick}
            loadingNotifications={loadingNotifications}
          />

          <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-900/20 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-800/30">
            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
                className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm"
                aria-label="Toggle Dark Mode"
              >
                {resolvedTheme === 'dark' ? (
                  <BsSunFill className="text-yellow-400 text-lg" />
                ) : (
                  <BsMoonStarsFill className="text-gray-700 text-lg" />
                )}
              </button>
            )}

            <div className="hidden md:block">
              {loadingUser ? (
                <div className="space-y-1 animate-pulse">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {user?.name || role.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || role.toUpperCase()}
                  </p>
                </>
              )}
            </div>

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="relative">
                  <Avatar
                    alt="User Avatar"
                    img={`https://ui-avatars.com/api/?name=${user?.name || role}&background=random`}
                    rounded
                    size="sm"
                    className="hover:scale-110 transition-all"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.name || role.toUpperCase()}
                </span>
                <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || `${role}@email.com`}
                </span>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={HiOutlineUserCircle}
                onClick={() => router.push(cfg.profileRoute)}
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                icon={HiMailOpen}
                onClick={() => router.push(cfg.inboxRoute)}
              >
                Inbox
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={HiOutlineLogout}
                onClick={() => setOpenLogout(true)}
                className="text-red-600 dark:text-red-400"
              >
                Logout
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>

      <LogoutConfirmationModal
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </Navbar>
  );
}
