"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Dropdown, Avatar, Spinner } from "flowbite-react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import {
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import NotificationDropdown from "@/components/ui/notification-dropdown";

const HeaderBupati = () => {
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
        if (response.status === 200) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchUser();
    fetchNotifications();
  }, []);

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

  // ✅ Filter hanya notifikasi untuk Bupati
  const filteredNotifications = notifications.filter((notif) =>
    notif.link.startsWith("/bupati-portal/")
  );

  const unreadCount = filteredNotifications.filter((notif) => !notif.isRead).length;

  const handleNotificationClick = async (notif) => {
    try {
      await axios.post("/api/notifications/read", { notificationId: notif.id });
      router.push(notif.link);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Gagal memperbarui notifikasi:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-white dark:bg-gray-800 shadow-lg py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/bupati-portal/dashboard" className="flex items-center gap-2">
          <HiOutlineHome className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Dashboard Bupati
          </span>
        </Link>
      </div>



      {/* 🔹 Tengah: Menu Navigasi (Desktop) */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/bupati-portal/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
          Dashboard
        </Link>
        <Link href="/bupati-portal/laporan-warga" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
          Laporan Warga
        </Link>
 
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
          aria-label="Toggle Dark Mode"
        >
          {theme === "light" ? <BsMoonStarsFill className="text-lg" /> : <BsSunFill className="text-lg text-yellow-400" />}
        </button>

        {/* 🔔 Notifikasi */}
        <NotificationDropdown
          notifications={filteredNotifications}
          unreadCount={unreadCount}
          handleNotificationClick={handleNotificationClick}
          loadingNotifications={loadingNotifications}
        />

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
 
          <Dropdown.Divider />
          <Dropdown.Item icon={HiOutlineLogout} onClick={() => setOpenModal(true)} className="text-red-600">
            Logout
          </Dropdown.Item>
        </Dropdown>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
        <Modal.Header>Konfirmasi Logout</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 dark:text-gray-300">Apakah Anda yakin ingin logout?</p>
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
    </nav>
  );
};

export default HeaderBupati;
