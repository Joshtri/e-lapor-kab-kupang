"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlineDocumentReport,
  HiOutlineUserGroup,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePencilAlt,
} from "react-icons/hi"

const BupatiSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const pathname = usePathname()

  const navLinkClass = (href) => {
    const isActive = pathname === href
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-green-100 text-green-700 font-semibold dark:bg-green-900/30 dark:text-green-300"
        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
    } ${!isSidebarOpen ? "justify-center" : ""}`
  }

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all shadow-lg fixed top-0 left-0 z-50 ${
        isSidebarOpen ? "w-64" : "w-20"
      } flex flex-col duration-300`}
    >
      {/* Header Sidebar - Styled like mail header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        {isSidebarOpen && (
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-2">
              <HiOutlineMail className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Bupati Mail</span>
          </div>
        )}
        <button
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <HiOutlineChevronLeft size={20} /> : <HiOutlineChevronRight size={20} />}
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
              <Link href="/bupati-portal/dashboard" className={navLinkClass("/bupati-portal/dashboard")}>
                <motion.div whileHover={{ rotate: [0, -10, 0] }} transition={{ duration: 0.5 }} className="relative">
                  <HiOutlineMail className="h-6 w-6" />
                  {pathname === "/bupati-portal/dashboard" && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-600 rounded-full"></span>
                  )}
                </motion.div>
                {isSidebarOpen && "Dashboard"}
              </Link>
            </li>
            <li>
              <Link href="/bupati-portal/report-warga" className={navLinkClass("/bupati-portal/report-warga")}>
                <motion.div whileHover={{ rotate: [0, -10, 0] }} transition={{ duration: 0.5 }}>
                  <HiMailOpen className="h-6 w-6" />
                </motion.div>
                {isSidebarOpen && "Kelola Pengaduan"}
              </Link>
            </li>
            {/* <li>
              <Link href="/bupati-portal/users" className={navLinkClass("/bupati-portal/users")}>
                <HiOutlineUserGroup className="h-6 w-6" />
                {isSidebarOpen && "Manajemen Pengguna"}
              </Link>
            </li> */}
            <li>
              <Link
                href="/bupati-portal/riwayat-pengaduan"
                className={navLinkClass("/bupati-portal/riwayat-pengaduan")}
              >
                <motion.div whileHover={{ y: [0, -2, 0] }} transition={{ repeat: 2, duration: 0.3 }}>
                  <HiOutlineDocumentReport className="h-6 w-6" />
                </motion.div>
                {isSidebarOpen && "Riwayat Pengaduan"}
              </Link>
            </li>
            <li>
              <Link href="/bupati-portal/logs" className={navLinkClass("/bupati-portal/logs")}>
                <motion.div whileHover={{ y: [0, -3, 0], x: [0, 3, 0] }} transition={{ duration: 0.5 }}>
                  <HiOutlinePencilAlt className="h-6 w-6" />
                </motion.div>
                {isSidebarOpen && "Compose Mail"}
              </Link>
            </li>
          </ul>
        </div>

        {isSidebarOpen && (
          <div className="mt-8 px-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800/30">
              <div className="flex items-center mb-2">
                <HiPaperAirplane className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 transform rotate-90" />
                <h4 className="font-medium text-green-800 dark:text-green-300">Mail Stats</h4>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="flex justify-between">
                  <span>Unread:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">18</span>
                </p>
                <p className="flex justify-between mt-1">
                  <span>Processed:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">132</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}

export default BupatiSidebar

