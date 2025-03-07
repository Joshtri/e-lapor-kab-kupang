"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { useTheme } from "next-themes";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

const HeaderPelapor = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
    <>
      <header className="fixed w-full z-20 top-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-between py-3 px-4 md:px-6">
          {/* Logo */}
          <Link href="/pelapor/dashboard" className="flex items-center">
            <HiOutlineChatAlt2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            <span className="ml-2 text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
              Lapor KK Bupati
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/pelapor/dashboard"
              className="text-gray-800 dark:text-gray-200 hover:text-green-500"
            >
              Beranda
            </Link>
            <Link
              href="/pelapor/log-laporan"
              className="text-gray-800 dark:text-gray-200 hover:text-green-500"
            >
              Log Laporan
            </Link>
          </nav>

          {/* Kanan */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Dark Mode */}
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

            {/* Logout Desktop */}
            <Button
              color="failure"
              onClick={() => setOpenModal(true)}
              size="sm"
              className="font-medium hidden md:flex"
            >
              Logout
            </Button>

            {/* Toggle Menu Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              <span className="sr-only">Open Menu</span>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4">
            <Link
              href="/pelapor/dashboard"
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500"
            >
              Beranda
            </Link>
            <Link
              href="/pelapor/log-laporan"
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500"
            >
              Log Laporan
            </Link>
            <Button
              color="failure"
              onClick={() => setOpenModal(true)}
              className="w-full mt-2"
            >
              Logout
            </Button>
          </div>
        )}
      </header>

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
    </>
  );
};

export default HeaderPelapor;
