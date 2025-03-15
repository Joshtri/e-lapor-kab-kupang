"use client";

import React, { useState } from "react";
import { Navbar, Button, Modal, Dropdown, Avatar } from "flowbite-react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import {
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { useTheme } from "next-themes";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AdminHeader = ({ toggleSidebar, isSidebarOpen, user }) => {
  const { theme, setTheme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

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
      className="py-4 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-40 top-0 left-0 transition-all duration-300"
    >
      <div className="flex justify-between items-center w-full">
        {/* Kiri: Menu & Judul */}
        <div className="flex items-center space-x-9">
          <button
            onClick={toggleSidebar}
            className="text-gray-900 dark:text-gray-100 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition-all"
          >
            <HiOutlineMenu className="h-7 w-7" />
          </button>
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Admin Panel
          </span>
        </div>

        {/* Kanan: Dark Mode, Hi Username & Avatar */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* 🏷️ Card Wrapper */}
          <div className="hidden md:flex items-center space-x-4 
            bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-gray-800 dark:to-gray-900
            px-4 py-2 rounded-lg shadow-md border border-blue-600 dark:border-gray-700
            transition-all duration-300 hover:shadow-lg"
          >
            
            {/* 👤 Hi, Username */}
            <div className="flex flex-col text-gray-800 dark:text-gray-300">
              <span className="font-medium text-base">
                Hi, {user?.name || "Admin"} 👋
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-400">
                {user?.role || "Administrator"}
              </span>
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
