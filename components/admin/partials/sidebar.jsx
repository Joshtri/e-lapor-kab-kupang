"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineReport, MdOutlineSupervisorAccount, MdOutlineHistoryEdu, MdOutlineSettings } from "react-icons/md";
import { HiOutlineClipboardCheck, HiOutlineUserGroup } from "react-icons/hi";
import { AiOutlineFileSearch } from "react-icons/ai";

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const pathname = usePathname();

  const navLinkClass = (href) => {
    const isActive = pathname === href;
    return `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
      isActive ? "bg-gray-700 text-white font-semibold" : "hover:bg-gray-800"
    } ${!isSidebarOpen ? "justify-center" : ""}`;
  };

  return (
    <aside
      className={`bg-gray-900 text-gray-100 h-screen transition-all shadow-lg fixed top-0 left-0 z-50 ${
        isSidebarOpen ? "w-64" : "w-20"
      } flex flex-col duration-300`}
    >
      {/* Header Sidebar */}
      <div className="p-4 flex items-center justify-between">
        {isSidebarOpen && <span className="text-lg font-bold">Admin Panel</span>}
        <button className="text-gray-100 hover:text-gray-400" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu Navigasi */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link href="/adm/dashboard" className={navLinkClass("/adm/dashboard")}>
              <MdOutlineReport />
              {isSidebarOpen && "Dashboard"}
            </Link>
          </li>
          <li>
            <Link href="/adm/reports" className={navLinkClass("/adm/reports")}>
              <HiOutlineClipboardCheck />
              {isSidebarOpen && "Kelola Pengaduan"}
            </Link>
          </li>
          <li>
            <Link href="/adm/users" className={navLinkClass("/adm/users")}>
              <HiOutlineUserGroup />
              {isSidebarOpen && "Manajemen Pengguna"}
            </Link>
          </li>
          <li>
            <Link href="/adm/history" className={navLinkClass("/adm/history")}>
              <MdOutlineHistoryEdu />
              {isSidebarOpen && "Riwayat Pengaduan"}
            </Link>
          </li>
          <li>
            <Link href="/adm/logs" className={navLinkClass("/adm/logs")}>
              <AiOutlineFileSearch />
              {isSidebarOpen && "Log Aktivitas"}
            </Link>
          </li>
          <li>
            <Link href="/adm/settings" className={navLinkClass("/adm/settings")}>
              <MdOutlineSettings />
              {isSidebarOpen && "Pengaturan"}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
