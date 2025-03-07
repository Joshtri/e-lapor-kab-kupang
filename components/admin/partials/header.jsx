"use client";

import React, { useState } from "react";
import { Navbar, Button, Modal, Dropdown, Avatar } from "flowbite-react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { HiOutlineMenu } from "react-icons/hi";
import { useTheme } from "next-themes";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, setTheme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", null, {
        withCredentials: true, // ✅ Penting kalau axios global butuh kirim cookie
      });
      toast.success("Berhasil logout! Mengarahkan ke halaman utama...");
  
      setTimeout(() => {
        router.push("/auth/login"); // ✅ Lebih baik langsung ke login, bukan ke "/" kalau ini logout user
      }, 1500); // Sedikit lebih cepat, biar UX makin smooth
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Gagal logout. Silakan coba lagi.");
    }
  };

  return (
    <Navbar
      fluid
      rounded
      className={`py-4 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-40 top-0 left-0 transition-all duration-300`}
    >
      <div className="flex justify-between items-center w-full">
        {/* Kiri: Menu & Judul */}
        <div className="flex items-center space-x-4 ml-20">
          {/* <button
            onClick={toggleSidebar}
            className="text-gray-900 dark:text-gray-100 focus:outline-none"
          >
            <HiOutlineMenu className="h-7 w-7" />
          </button> */}

          <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Admin Panel
          </span>
        </div>

        {/* Kanan: Dark Mode & Avatar */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle Dark Mode"
          >
            {theme === "light" ? (
              <BsMoonStarsFill className="text-gray-700 dark:text-gray-300 text-lg" />
            ) : (
              <BsSunFill className="text-yellow-400 text-lg" />
            )}
          </button>

          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User Avatar" rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium">Admin</span>
              <span className="block truncate text-sm text-gray-500">
                admin@email.com
              </span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => setOpenModal(true)}
              className="text-red-600"
            >
              Logout
            </Dropdown.Item>
          </Dropdown>
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
