"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "flowbite-react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { useTheme } from "next-themes";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs"; // Ikon lebih clean
import Link from "next/link";

const HeaderPelapor = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Pastikan komponen hanya dipasang di klien untuk menghindari kesalahan rendering server
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar fluid rounded className="py-4 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-20 top-0">
      {/* Logo dan Nama Aplikasi */}
      <Navbar.Brand href="/pelapor/dashboard">
        <HiOutlineChatAlt2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        <span className="self-center whitespace-nowrap text-2xl font-bold text-gray-800 dark:text-gray-200 ml-2">
          Lapor KK Bupati
        </span>
      </Navbar.Brand>

      {/* Tombol Mode Gelap Minimalis & Toggle Menu */}
      <div className="flex md:order-2 items-center space-x-3">
        {/* Tombol Dark Mode Minimalis */}
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

        {/* Toggle Menu */}
        <Navbar.Toggle />
      </div>

      {/* Menu Navigasi */}
      <Navbar.Collapse>
        <Navbar.Link as={Link} href="/pelapor/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-green-500">
          Beranda
        </Navbar.Link>
        <Navbar.Link as={Link} href="/buat-laporan" className="text-gray-800 dark:text-gray-200 hover:text-green-500">
          Buat Laporan
        </Navbar.Link>
        <Navbar.Link as={Link} href="/status-laporan" className="text-gray-800 dark:text-gray-200 hover:text-green-500">
          Status Laporan
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HeaderPelapor;
