'use client';

import { navigationItemConfig } from '@/config/navigationItemConfig'; // Adjust the import path as necessary
import clsx from 'clsx';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  HiOutlineChevronRight
} from 'react-icons/hi';

// Custom Tooltip Component for collapsed sidebar
const Tooltip = ({ text, children, position = 'right', disabled = false }) => {
  if (disabled) return children;

  return (
    <div className="relative group/tooltip">
      {children}
      <motion.div
        initial={{ opacity: 0, x: position === 'right' ? 10 : -10, scale: 0.95 }}
        whileHover={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`absolute top-1/2 -translate-y-1/2 ${
          position === 'right' ? 'left-full ml-4' : 'right-full mr-4'
        } bg-gray-900 dark:bg-gray-950 text-white text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap pointer-events-none z-[9999] shadow-xl opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto invisible group-hover/tooltip:visible transition-all duration-150`}
      >
        {text}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-4 ${
            position === 'right'
              ? '-right-2 border-r-gray-900 dark:border-r-gray-950 border-t-transparent border-b-transparent border-l-transparent'
              : '-left-2 border-l-gray-900 dark:border-l-gray-950 border-t-transparent border-b-transparent border-r-transparent'
          }`}
        />
      </motion.div>
    </div>
  );
};

const Sidebar = ({ isSidebarOpen, toggleSidebar, role = 'admin' }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({
    chat: 0,
    reports: 0,
  });
  const [expandedMenus, setExpandedMenus] = useState({});

  const colorMap = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      darkBg: 'dark:bg-blue-900/30',
      darkText: 'dark:text-blue-300',
      border: 'border-blue-600',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      darkBg: 'dark:bg-purple-900/30',
      darkText: 'dark:text-purple-300',
      border: 'border-purple-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      darkBg: 'dark:bg-green-900/30',
      darkText: 'dark:text-green-300',
      border: 'border-green-600',
    },
  };
  // Role configurations

  const currentConfig = navigationItemConfig[role] || navigationItemConfig.admin;
  const color = currentConfig.color;

  const navLinkClass = (href) => {
    // Normalize paths by removing trailing slashes for comparison
    const normalizedPathname = pathname?.replace(/\/$/, '') || '';
    const normalizedHref = href.replace(/\/$/, '');
    const isActive = normalizedPathname === normalizedHref;
    const colorClass = colorMap[color] || colorMap.blue;

    return clsx(
      'relative flex items-center gap-3 py-3 rounded-lg transition-all border-l-4 group',
      isSidebarOpen ? 'pl-3 pr-4' : 'p-2 justify-center',
      isActive
        ? `${colorClass.border} ${colorClass.bg} ${colorClass.text} font-semibold ${colorClass.darkBg} ${colorClass.darkText} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ${colorClass.border.replace('border-', 'ring-')}`
        : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    );
  };

  // Detect mobile screen and auto-close sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);

      // Auto-close sidebar when switching to mobile
      if (mobile && isSidebarOpen) {
        toggleSidebar();
      }
    };

    // Set initial value
    setIsMobile(window.innerWidth < 768);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, toggleSidebar]);

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
        'Failed to fetch unread counts:', err;
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

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const renderRoute = (route, index) => {
    if (route.type === 'expandable') {
      const normalizedPathname = pathname?.replace(/\/$/, '') || '';
      // Check if any subroute is active
      const isActive = route.subRoutes?.some((subRoute) =>
        normalizedPathname.startsWith(subRoute.path.replace(/\/$/, ''))
      );
      const isExpanded = expandedMenus[route.name] || false;

      return (
        <div key={index} className="space-y-1">
          <Tooltip text={route.name} position="right" disabled={isSidebarOpen}>
            <button
              type="button"
              onClick={() => toggleMenu(route.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all group ${
                isActive
                  ? `${colorMap[color].bg} ${colorMap[color].text} ${colorMap[color].darkBg} ${colorMap[color].darkText} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ${colorMap[color].border.replace('border-', 'ring-')}`
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${!isSidebarOpen ? 'justify-center px-3' : ''}`}
            >
              <route.icon className="h-6 w-6 flex-shrink-0" />
              {isSidebarOpen && (
                <span className="flex-1 text-left">{route.name}</span>
              )}
              {isSidebarOpen && (
                <HiOutlineChevronRight
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              )}
            </button>
          </Tooltip>

          {isSidebarOpen && isExpanded && (
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
        <Tooltip text={route.name} position="right" disabled={isSidebarOpen}>
          <Link href={route.path} className={navLinkClass(route.path)}>
            <motion.div {...(route.motion || {})} className="relative flex-shrink-0">
              <route.icon className="h-6 w-6" />
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
        </Tooltip>
      </li>
    );
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all shadow-lg fixed top-0 left-0 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col duration-300`}
    >
      {/* Header Sidebar - Logo only */}
      <div className="p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        {isSidebarOpen && (
          <div className="flex items-center gap-2 w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/fixed-logo-app.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">
              {currentConfig.title}
            </span>
          </div>
        )}
        {/* Logo icon-only when collapsed */}
        {!isSidebarOpen && (
          <div className="flex justify-center w-full">
            <Image
              src="/fixed-logo-app.png"
              alt="Logo"
              width={36}
              height={36}
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        <div className="mb-4">
          {isSidebarOpen && (
            // <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            //   Main Menu
            // </h3>
            <>
            </>
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
