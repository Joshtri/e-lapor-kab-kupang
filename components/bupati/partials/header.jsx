"use client";

import React, { useState } from "react";
import { Navbar, Button, Dropdown, Avatar, Modal, NavbarLink } from "flowbite-react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { HiOutlineUserCircle, HiOutlineLogout, HiOutlineHome, HiOutlineClipboardCheck } from "react-icons/hi";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

const HeaderBupati = ({ user }) => {
  const { theme, setTheme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logout berhasil! Anda akan diarahkan ke halaman utama.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Terjadi kesalahan saat logout.");
    }
  };

  return (
    <Navbar fluid rounded className="py-4 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-40 top-0">
      {/* Brand Logo */}
      <Navbar.Brand href="/bupati-portal/dashboard">
        <HiOutlineHome className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-200 ml-2">Dashboard Bupati</span>
      </Navbar.Brand>

      {/* Menu Navigasi */}
      <Navbar.Collapse>
        <NavbarLink as={Link} href="/bupati-portal/laporan" className="text-gray-800 dark:text-gray-200 hover:text-blue-500">
          Daftar Laporan
        </NavbarLink>
        <NavbarLink as={Link} href="/bupati-portal/statistik" className="text-gray-800 dark:text-gray-200 hover:text-blue-500">
          Statistik
        </NavbarLink>
      </Navbar.Collapse>

      {/* Aksi Kanan */}
      <div className="flex md:order-2 items-center space-x-3">
        {/* Tombol Dark Mode */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          aria-label="Toggle Dark Mode"
        >
          {theme === "light" ? <BsMoonStarsFill className="text-gray-700 dark:text-gray-300 text-lg" /> : <BsSunFill className="text-yellow-400 text-lg" />}
        </button>

        {/* Dropdown Profil */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User" img="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0ieHhsYXJnZSI+CiAgICA8Zz4KICAgICAgICA8Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSI2NCIgZmlsbD0iIzg5OTNhNCIgLz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZmlsbD0iI2ZmZiIKICAgICAgICAgICAgICAgIGQ9Ik0xMDMsMTAyLjEzODggQzkzLjA5NCwxMTEuOTIgNzkuMzUwNCwxMTggNjQuMTYzOCwxMTggQzQ4LjgwNTYsMTE4IDM0LjkyOTQsMTExLjc2OCAyNSwxMDEuNzg5MiBMMjUsOTUuMiBDMjUsODYuODA5NiAzMS45ODEsODAgNDAuNiw4MCBMODcuNCw4MCBDOTYuMDE5LDgwIDEwMyw4Ni44MDk2IDEwMyw5NS4yIEwxMDMsMTAyLjEzODggWiIgLz4KICAgICAgICAgICAgPHBhdGggZmlsbD0iI2ZmZiIKICAgICAgICAgICAgICAgIGQ9Ik02My45OTYxNjQ3LDI0IEM1MS4yOTM4MTM2LDI0IDQxLDM0LjI5MzgxMzYgNDEsNDYuOTk2MTY0NyBDNDEsNTkuNzA2MTg2NCA1MS4yOTM4MTM2LDcwIDYzLjk5NjE2NDcsNzAgQzc2LjY5ODUxNTksNzAgODcsNTkuNzA2MTg2NCA4Nyw0Ni45OTYxNjQ3IEM4NywzNC4yOTM4MTM2IDc2LjY5ODUxNTksMjQgNjMuOTk2MTY0NywyNCIgLz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=" rounded size="sm" />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm font-medium">{user?.name}</span>
            <span className="block text-sm text-gray-500 truncate">{user?.email}</span>
          </Dropdown.Header>
          <Dropdown.Item icon={HiOutlineUserCircle} as={Link} href="/bupati/profile">
            Profil Saya
          </Dropdown.Item>
          <Dropdown.Item icon={HiOutlineClipboardCheck} as={Link} href="/bupati/laporan">
            Daftar Laporan
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item icon={HiOutlineLogout} onClick={() => setOpenModal(true)}>
            Logout
          </Dropdown.Item>
        </Dropdown>

        <Navbar.Toggle />
      </div>

      {/* Modal Logout */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
        <Modal.Header>Konfirmasi Logout</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 dark:text-gray-300">Apakah Anda yakin ingin logout?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleLogout}>Ya, Logout</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>Batal</Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default HeaderBupati;
