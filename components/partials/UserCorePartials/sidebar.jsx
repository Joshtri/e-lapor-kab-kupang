'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiMailOpen,
  HiOutlineDocumentReport,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePencilAlt,
  HiOutlineBell,
  HiChat,
} from 'react-icons/hi';
import { FaBug } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, role = 'admin' }) => {
  const pathname = usePathname();
  const [unreadCounts, setUnreadCounts] = useState({
    chat: 0,
    reports: 0,
  });
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Role configurations
  const roleConfig = {
    admin: {
      title: 'Mail Admin',
      color: 'blue',
      routes: [
        {
          path: '/adm/dashboard',
          name: 'Dashboard',
          icon: HiOutlineMail,
        },
        {
          path: '/adm/report-warga',
          name: 'Kelola Pengaduan',
          icon: HiMailOpen,
        },
        {
          path: '/adm/users',
          name: 'Manajemen Pengguna',
          icon: HiOutlineUserGroup,
        },
        {
          path: '/adm/org-perangkat-daerah',
          name: 'Manajemen OPD',
          icon: HiOutlineOfficeBuilding,
        },
        {
          path: '/adm/riwayat-pengaduan',
          name: 'Riwayat Pengaduan',
          icon: HiOutlineDocumentReport,
          motion: {
            whileHover: { y: [0, -2, 0] },
            transition: { repeat: 2, duration: 0.3 },
          },
        },
        {
          type: 'expandable',
          name: 'Notification',
          icon: HiOutlineBell,
          subRoutes: [
            {
              path: '/adm/notifications/send-notifications',
              name: 'Send Notification',
              icon: HiOutlinePencilAlt,
            },
            {
              path: '/adm/notifications/list-notifications',
              name: 'List Notification',
              icon: HiOutlineMail,
            },
          ],
        },
        {
          path: '/adm/bugs',
          name: 'Bug Report',
          icon: FaBug,
          motion: {
            whileHover: { y: [0, -3, 0], x: [0, 3, 0] },
            transition: { duration: 0.5 },
          },
        },
      ],
    },
    opd: {
      title: 'OPD Mail',
      color: 'purple',
      routes: [
        {
          path: '/opd/dashboard',
          name: 'Dashboard',
          icon: HiOutlineMail,
          motion: {
            whileHover: { rotate: [0, -10, 0] },
            transition: { duration: 0.5 },
          },
        },
        {
          path: '/opd/laporan-warga',
          name: 'Kelola Pengaduan',
          icon: HiMailOpen,
          motion: {
            whileHover: { rotate: [0, -10, 0] },
            transition: { duration: 0.5 },
          },
        },
        {
          path: '/opd/chat',
          name: 'Chat',
          icon: HiChat,
          badge: 'chat',
          motion: { whileHover: { scale: 1.1 }, transition: { duration: 0.3 } },
        },
      ],
    },
    bupati: {
      title: 'Bupati Mail',
      color: 'green',
      routes: [
        {
          path: '/bupati-portal/dashboard',
          name: 'Dashboard',
          icon: HiOutlineMail,
          motion: {
            whileHover: { rotate: [0, -10, 0] },
            transition: { duration: 0.5 },
          },
        },
        {
          path: '/bupati-portal/laporan-warga',
          name: 'Kelola Pengaduan',
          icon: HiMailOpen,
          badge: 'reports',
          motion: {
            whileHover: { rotate: [0, -10, 0] },
            transition: { duration: 0.5 },
          },
        },
        {
          path: '/bupati-portal/riwayat-pengaduan',
          name: 'Riwayat Pengaduan',
          icon: HiOutlineDocumentReport,
          motion: {
            whileHover: { y: [0, -2, 0] },
            transition: { repeat: 2, duration: 0.3 },
          },
        },
        {
          path: '/bupati-portal/chat',
          name: 'Pesan Masuk',
          icon: HiOutlineMail,
          badge: 'chat',
          motion: {
            whileHover: { rotate: [0, -10, 0] },
            transition: { duration: 0.5 },
          },
        },
        {
          path: '/bupati-portal/logs',
          name: 'Compose Mail',
          icon: HiOutlinePencilAlt,
          motion: {
            whileHover: { y: [0, -3, 0], x: [0, 3, 0] },
            transition: { duration: 0.5 },
          },
        },
      ],
    },
  };

  const currentConfig = roleConfig[role] || roleConfig.admin;
  const color = currentConfig.color;

  const navLinkClass = (href) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? `bg-${color}-100 text-${color}-700 font-semibold dark:bg-${color}-900/30 dark:text-${color}-300`
        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
    } ${!isSidebarOpen ? 'justify-center' : ''}`;
  };

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        if (role === 'opd') {
          const res = await fetch('/api/opd/chat/unread-count');
          const data = await res.json();
          setUnreadCounts({ chat: data.unreadCount || 0, reports: 0 });
        } else if (role === 'bupati') {
          const [laporanRes, chatRes] = await Promise.all([
            fetch('/api/bupati/laporan/unread-count'),
            fetch('/api/bupati/chat/unread-count'),
          ]);
          const laporan = await laporanRes.json();
          const chat = await chatRes.json();
          setUnreadCounts({
            chat: chat.unreadCount || 0,
            reports: laporan.unreadCount || 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch unread counts:', err);
      }
    };

    fetchUnreadCounts();
  }, [role]);

  const renderBadge = (type) => {
    const count = unreadCounts[type];
    if (!count) return null;

    return (
      <span
        className={`absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none shadow`}
      >
        {count}
      </span>
    );
  };

  const renderRoute = (route, index) => {
    if (route.type === 'expandable') {
      return (
        <div key={index} className="space-y-1">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
              pathname?.startsWith('/adm/notifications')
                ? `bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-300`
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            } ${!isSidebarOpen ? 'justify-center' : ''}`}
          >
            <route.icon className="h-6 w-6" />
            {isSidebarOpen && (
              <span className="flex-1 text-left">{route.name}</span>
            )}
            {isSidebarOpen && (
              <HiOutlineChevronRight
                className={`h-4 w-4 transition-transform duration-300 ${
                  isNotifOpen ? 'rotate-90' : ''
                }`}
              />
            )}
          </button>

          {isSidebarOpen && isNotifOpen && (
            <ul className="ml-6 space-y-1 mt-1">
              {route.subRoutes.map((subRoute, subIndex) => (
                <li key={subIndex}>
                  <Link
                    href={subRoute.path}
                    className={navLinkClass(subRoute.path)}
                  >
                    <subRoute.icon className="h-5 w-5" />
                    {subRoute.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return (
      <li key={index}>
        <Link href={route.path} className={navLinkClass(route.path)}>
          <motion.div {...(route.motion || {})} className="relative">
            <route.icon className="h-6 w-6" />
            {pathname === route.path && (
              <span
                className={`absolute -top-1 -right-1 h-2 w-2 bg-${color}-600 rounded-full`}
              ></span>
            )}
            {route.badge && renderBadge(route.badge)}
          </motion.div>
          {isSidebarOpen && (
            <div className="flex items-center gap-2 relative">
              <span>{route.name}</span>
              {route.badge && unreadCounts[route.badge] > 0 && (
                <span className="bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                  {unreadCounts[route.badge]}
                </span>
              )}
            </div>
          )}
        </Link>
      </li>
    );
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all shadow-lg fixed top-0 left-0 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col duration-300`}
    >
      {/* Header Sidebar */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        {isSidebarOpen && (
          <div className="flex items-center">
            <div
              className={`bg-${color}-100 dark:bg-${color}-900/30 p-2 rounded-full mr-2`}
            >
              <HiOutlineMail
                className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`}
              />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {currentConfig.title}
            </span>
          </div>
        )}
        <button
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <HiOutlineChevronLeft size={20} />
          ) : (
            <HiOutlineChevronRight size={20} />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        <div className="mb-4">
          {isSidebarOpen && (
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Main Menu
            </h3>
          )}
          <ul className="space-y-1 mt-2">
            {currentConfig.routes.map((route, index) =>
              renderRoute(route, index),
            )}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
