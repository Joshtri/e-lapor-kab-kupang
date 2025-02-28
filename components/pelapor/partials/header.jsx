"use client";

import React from "react";
import { Navbar, DarkThemeToggle } from "flowbite-react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { useTheme } from "next-themes";

const HeaderPelapor = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Navbar fluid rounded className="py-4 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-20 top-0">
      <Navbar.Brand href="/">
        <HiOutlineChatAlt2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        <span className="self-center whitespace-nowrap text-2xl font-bold text-gray-800 dark:text-gray-200 ml-2">
          Lapor KK Bupati
        </span>
      </Navbar.Brand>

      <div className="flex md:order-2">
        <DarkThemeToggle
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2.5 rounded-lg"
          aria-label="Toggle dark mode"
        />
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link href="/pelapor-dashboard" className="text-gray-800 dark:text-gray-200 hover:text-green-500">
          Beranda
        </Navbar.Link>
        {/* <Navbar.Link href="/pengaduan" className="text-gray-800 dark:text-gray-200 hover:text-green-500">
          Pengaduan
        </Navbar.Link>
        <Navbar.Link href="/kontak" className="text-gray-800 dark:text-gray-200 hover:text-green-500">
          Kontak
        </Navbar.Link> */}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HeaderPelapor;
