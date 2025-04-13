'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlineDocumentReport,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePencilAlt,
  HiOutlineBell,
} from 'react-icons/hi';
import { useState } from 'react';
import { FaBug } from 'react-icons/fa';

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navLinkClass = (href) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? 'bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900/30 dark:text-blue-300'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
    } ${!isSidebarOpen ? 'justify-center' : ''}`;
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all shadow-lg fixed top-0 left-0 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col duration-300`}
    >
      {/* Header Sidebar - Styled like mail header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        {isSidebarOpen && (
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-2">
              <HiOutlineMail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Mail Admin
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

      {/* Menu Navigasi - Styled like mail folders */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        <div className="mb-4">
          {isSidebarOpen && (
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Main Menu
            </h3>
          )}
          <ul className="space-y-1 mt-2">
            <li>
              <Link
                href="/adm/dashboard"
                className={navLinkClass('/adm/dashboard')}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <HiOutlineMail className="h-6 w-6" />
                  {pathname === '/adm/dashboard' && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></span>
                  )}
                </motion.div>
                {isSidebarOpen && 'Dashboard'}
              </Link>
            </li>
            <li>
              <Link
                href="/adm/report-warga"
                className={navLinkClass('/adm/report-warga')}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <HiMailOpen className="h-6 w-6" />
                </motion.div>
                {isSidebarOpen && 'Kelola Pengaduan'}
              </Link>
            </li>
            <li>
              <Link href="/adm/users" className={navLinkClass('/adm/users')}>
                <HiOutlineUserGroup className="h-6 w-6" />
                {isSidebarOpen && 'Manajemen Pengguna'}
              </Link>
            </li>
            <li>
              <Link
                href="/adm/org-perangkat-daerah"
                className={navLinkClass('/adm/org-perangkat-daerah')}
              >
                <HiOutlineOfficeBuilding className="h-6 w-6" />
                {isSidebarOpen && 'Manajemen OPD'}
              </Link>
            </li>
            <li>
              <Link
                href="/adm/riwayat-pengaduan"
                className={navLinkClass('/adm/riwayat-pengaduan')}
              >
                <motion.div
                  whileHover={{ y: [0, -2, 0] }}
                  transition={{ repeat: 2, duration: 0.3 }}
                >
                  <HiOutlineDocumentReport className="h-6 w-6" />
                </motion.div>
                {isSidebarOpen && 'Riwayat Pengaduan'}
              </Link>
            </li>
            {/* <li>
              <Link href="/adm/mail" className={navLinkClass('/adm/mail')}>
                <motion.div
                  whileHover={{ y: [0, -3, 0], x: [0, 3, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <HiOutlinePencilAlt className="h-6 w-6" />
                </motion.div>
                {isSidebarOpen && 'Compose Mail'}
              </Link>
            </li> */}
            {/* Notification group menu (expandable) */}
            <li className="space-y-1">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  pathname?.startsWith('/adm/send-notification') ||
                  pathname?.startsWith('/adm/notification-list')
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${!isSidebarOpen ? 'justify-center' : ''}`}
              >
                <HiOutlineBell className="h-6 w-6" />
                {isSidebarOpen && (
                  <span className="flex-1 text-left">Notification</span>
                )}
                {isSidebarOpen && (
                  <HiOutlineChevronRight
                    className={`h-4 w-4 transition-transform duration-300 ${isNotifOpen ? 'rotate-90' : ''}`}
                  />
                )}
              </button>

              {isSidebarOpen && isNotifOpen && (
                <ul className="ml-6 space-y-1 mt-1">
                  <li>
                    <Link
                      href="/adm/notifications/send-notifications"
                      className={navLinkClass(
                        '/adm/notifications/send-notifications',
                      )}
                    >
                      <HiOutlinePencilAlt className="h-5 w-5" />
                      Send Notification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/adm/notifications/list-notifications"
                      className={navLinkClass(
                        '/adm/notifications/list-notifications',
                      )}
                    >
                      <HiOutlineMail className="h-5 w-5" />
                      List Notification
                    </Link>
                  </li>
                </ul>
              )}

              <li>
                <Link href="/adm/bugs" className={navLinkClass('/adm/bugs')}>
                  <motion.div
                    whileHover={{ y: [0, -3, 0], x: [0, 3, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaBug className="h-6 w-6" />
                  </motion.div>
                  {isSidebarOpen && 'Bug Report'}
                </Link>
              </li>
            </li>
          </ul>
        </div>
 
      </nav>
    </aside>
  );
};

export default AdminSidebar;
