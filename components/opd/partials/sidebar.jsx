'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlineDocumentReport,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiChat,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import axios from 'axios';

const OpdSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const navLinkClass = (href) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? 'bg-purple-100 text-purple-700 font-semibold dark:bg-purple-900/30 dark:text-purple-300'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
    } ${!isSidebarOpen ? 'justify-center' : ''}`;
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get('/api/opd/chat/unread-count');
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error('Gagal mengambil jumlah chat belum dibaca:', err);
      }
    };
    fetchUnread();
  }, []);

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all shadow-lg fixed top-0 left-0 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col duration-300`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        {isSidebarOpen && (
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-2">
              <HiOutlineMail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              OPD Mail
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
                href="/opd/dashboard"
                className={navLinkClass('/opd/dashboard')}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <HiOutlineMail className="h-6 w-6" />
                  {pathname === '/opd/dashboard' && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-purple-600 rounded-full"></span>
                  )}
                </motion.div>
                {isSidebarOpen && 'Dashboard'}
              </Link>
            </li>
            <li>
              <Link
                href="/opd/laporan-warga"
                className={navLinkClass('/opd/laporan-warga')}
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
              <Link href="/opd/chat" className={navLinkClass('/opd/chat')}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <HiChat className="h-6 w-6" />
                  {unreadCount > 0 && !isSidebarOpen && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
                      {unreadCount}
                    </span>
                  )}
                </motion.div>
                {isSidebarOpen && (
                  <div className="flex items-center gap-2 relative">
                    <span>Chat</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default OpdSidebar;
