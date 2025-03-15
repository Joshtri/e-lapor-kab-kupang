"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Dropdown, Avatar, Spinner } from "flowbite-react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import {
  HiOutlineBell,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineClipboardCheck,
  HiOutlineChartSquareBar,
  HiOutlineCog,
  HiOutlineMenu,
} from "react-icons/hi";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

const HeaderBupati = () => {
  const { theme, setTheme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchUser();
    fetchNotifications();
  }, []);

  const markAsRead = async (notifId, link) => {
    try {
      await axios.patch(`/api/notifications/${notifId}/read`);
      setNotifications(notifications.filter((n) => n.id !== notifId));
      if (link) router.push(link);
    } catch (error) {
      console.error("Gagal menandai notifikasi:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Berhasil logout! Mengarahkan ke login...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Gagal logout. Silakan coba lagi.");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-white dark:bg-gray-800 shadow-lg py-4 px-6 flex justify-between items-center">
      {/* Kiri: Logo & Navigasi */}
      <div className="flex items-center gap-4">
        <Link href="/bupati-portal/dashboard" className="flex items-center gap-2">
          <HiOutlineHome className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Dashboard Bupati
          </span>
        </Link>
      </div>

      {/* MENU NAVIGASI (Hanya Muncul di Desktop) */}
      <div className="hidden md:flex gap-8 text-gray-700 dark:text-gray-300">
        <Link href="/bupati-portal/dashboard" className="hover:text-blue-500">
          Dashboard
        </Link>
        <Link href="/bupati-portal/laporan-warga" className="hover:text-blue-500">
          Daftar Laporan
        </Link>
        {/* <Link href="/bupati-portal/statistik" className="hover:text-blue-500">
          Statistik
        </Link>
        <Link href="/bupati-portal/pengaturan" className="hover:text-blue-500">
          Pengaturan
        </Link> */}
      </div>

      {/* Kanan: Dark Mode, Notifikasi, Profil */}
      <div className="flex items-center gap-4">
        {/* 🌗 Dark Mode Toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
          aria-label="Toggle Dark Mode"
        >
          {theme === "light" ? <BsMoonStarsFill className="text-lg" /> : <BsSunFill className="text-lg text-yellow-400" />}
        </button>

        {/* 🔔 Notifikasi */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="relative">
              <HiOutlineBell className="h-6 w-6 text-gray-700 dark:text-gray-300 cursor-pointer" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {notifications.length}
                </span>
              )}
            </div>
          }
        >
          <Dropdown.Header>
            <span className="text-sm font-semibold">Notifikasi</span>
          </Dropdown.Header>

          <div className="w-80 max-w-xs max-h-96 overflow-y-auto">
            {loadingNotifications ? (
              <p className="text-center text-gray-500 py-2">Memuat notifikasi...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-2">Belum ada notifikasi</p>
            ) : (
              notifications.map((notif) => (
                <Dropdown.Item
                  key={notif.id}
                  onClick={() => markAsRead(notif.id, notif.link)}
                  className="flex flex-col items-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <p className="text-sm font-medium">{notif.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </Dropdown.Item>
              ))
            )}
          </div>
        </Dropdown>

        {/* 👤 Avatar & Dropdown Profil */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User"
              img={`https://ui-avatars.com/api/?name=${user?.name || "Bupati"}&background=random`}
              rounded
              size="sm"
            />
          }
        >
          <Dropdown.Header>
            {loadingUser ? (
              <Spinner size="sm" />
            ) : (
              <>
                <span className="block text-sm font-medium">{user?.name || "Bupati"}</span>
                <span className="block text-sm text-gray-500 truncate">{user?.email || "bupati@email.com"}</span>
              </>
            )}
          </Dropdown.Header>
          <Dropdown.Item as={Link} href="/bupati-portal/dashboard" icon={HiOutlineUserCircle}>
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item as={Link} href="/bupati-portal/profile" icon={HiOutlineUserCircle}>
            Profil Saya
          </Dropdown.Item>
          <Dropdown.Item as={Link} href="/bupati-portal/laporan-warga" icon={HiOutlineClipboardCheck}>
            Daftar Laporan
          </Dropdown.Item>
          {/* <Dropdown.Item as={Link} href="/bupati-portal/statistik" icon={HiOutlineChartSquareBar}>
            Statistik
          </Dropdown.Item> */}
          {/* <Dropdown.Item as={Link} href="/bupati-portal/pengaturan" icon={HiOutlineCog}>
            Pengaturan
          </Dropdown.Item> */}
          <Dropdown.Divider />
          <Dropdown.Item icon={HiOutlineLogout} onClick={() => setOpenModal(true)} className="text-red-600">
            Logout
          </Dropdown.Item>
        </Dropdown>
      </div>
    </nav>
  );
};

export default HeaderBupati;
