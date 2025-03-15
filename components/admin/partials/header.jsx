"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  Button,
  Modal,
  Dropdown,
  Avatar,
  Spinner,
} from "flowbite-react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import {
  HiBell,
  HiDesktopComputer,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineUserCircle,
  HiShieldCheck,
} from "react-icons/hi";
import { useTheme } from "next-themes";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, setTheme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me", {
          validateStatus: () => true, // Agar semua status diterima
        });

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
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

    fetchNotifications();
  }, []);

  // ✅ Fungsi untuk Menandai Notifikasi sebagai "Dibaca"
  const markAsRead = async (notifId, link) => {
    try {
      await axios.patch(`/api/notifications/${notifId}/read`);
      setNotifications(notifications.filter((n) => n.id !== notifId));

      // Redirect jika ada link
      if (link) {
        router.push(link);
      }
    } catch (error) {
      console.error("Gagal menandai notifikasi sebagai dibaca:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", null, {
        withCredentials: true,
      });
      toast.success("Berhasil logout! Mengarahkan ke halaman utama...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Gagal logout. Silakan coba lagi.");
    }
  };

  return (
    <Navbar
      fluid
      rounded
      className="py-1 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-40 top-0 left-0 transition-all duration-300"
    >
      <div className="flex justify-between items-center w-full">
        {/* Kiri: Menu & Judul */}
        <div
          className="flex items-center space-x-8 bg-white/30 dark:bg-gray-800 backdrop-blur-md 
        px-3 py-3 rounded-xl  border-gray-300 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
        >
          <button
            onClick={toggleSidebar}
            className="text-white dark:text-gray-100 focus:outline-none hover:bg-white/20 p-2 rounded-md transition-all"
          >
            <HiOutlineMenu className="h-7 w-7" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Admin Panel
              </span>
              <HiDesktopComputer className="h-5 w-5 text-gray-800 dark:text-gray-300" />
            </div>
            <span className="text-xs text-gray-800 dark:text-gray-400">
              Sistem Manajemen
            </span>
          </div>
        </div>

        {/* Kanan: Dark Mode, Hi Username & Avatar */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* 🔔 Notifikasi */}
          <div className="relative">
            {/* 🔔 Dropdown Notifikasi */}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="relative">
                  <HiBell className="h-6 w-6 text-gray-700 dark:text-gray-300 cursor-pointer" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                      {notifications.length}
                    </span>
                  )}
                </div>
              }
            >
              <Dropdown.Header>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Notifikasi
                </span>
              </Dropdown.Header>

              {/* 💡 Atur Ukuran Dropdown */}
              <div className="w-80 max-w-xs max-h-96 overflow-y-auto">
                {loadingNotifications ? (
                  <p className="text-center text-gray-500 py-2">
                    Memuat notifikasi...
                  </p>
                ) : notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-2">
                    Belum ada notifikasi
                  </p>
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
          </div>
          {/* 🏷️ Card Wrapper */}
          <div
            className="hidden md:flex items-center space-x-4 
            bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-gray-800 dark:to-gray-900
            px-4 py-2 rounded-lg shadow-md border border-blue-600 dark:border-gray-700
            transition-all duration-300 hover:shadow-lg"
          >
            {/* 👤 Hi, Username */}
            <div className="flex flex-col text-gray-800 dark:text-gray-300">
              {loadingUser ? (
                <div className="space-y-2">
                  {/* Skeleton untuk Hi, Username */}
                  <div className="w-28 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  {/* Skeleton untuk Role */}
                  <div className="w-20 h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <span className="font-medium text-base">
                    Hi, {user?.name || "Admin"} 👋
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                    {user?.role || "Administrator"}
                  </span>
                </>
              )}
            </div>

            {/* 🌗 Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-full bg-white dark:bg-gray-700 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {theme === "light" ? (
                <BsMoonStarsFill className="text-gray-700 dark:text-gray-300 text-lg" />
              ) : (
                <BsSunFill className="text-yellow-400 text-lg" />
              )}
            </button>

            {/* 👤 Avatar & Dropdown */}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User Avatar"
                  img={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=random`}
                  rounded
                  size="sm"
                  className="  dark:border-gray-300 hover:scale-110 transition-all duration-300 shadow-sm"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.name || "Admin"}
                </span>
                <span className="block truncate text-sm text-gray-800 dark:text-gray-400">
                  {user?.email || "admin@email.com"}
                </span>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={HiOutlineUserCircle}
                onClick={() => router.push("/admin/profile")}
              >
                Profil Saya
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={HiOutlineLogout}
                onClick={() => setOpenModal(true)}
                className="text-red-600"
              >
                Logout
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>

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
    </Navbar>
  );
};

export default AdminHeader;
