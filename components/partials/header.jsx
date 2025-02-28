"use client";

import React, { useEffect, useState } from "react";
import { Button, Navbar } from "flowbite-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs"; // Import Ikon Dark Mode

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Pastikan komponen hanya berjalan di client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Navbar
      fluid
      rounded
      className="py-4 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-20 top-0"
    >
      <Navbar.Brand as={Link} href="/" className="flex items-center gap-3">
        {/* Logo Lembaga */}
        <img src="/logo-kab-kupang.png" alt="Logo Lembaga" className="w-10 h-10" /> 

        {/* Nama Lembaga */}
        <span className="self-center text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Lapor KK BUPATI
        </span>
      </Navbar.Brand>

      <div className="flex md:order-2">
        <div className="flex items-center gap-4">
          {/* Desktop View */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-black dark:text-gray-100">
              Beranda
            </Link>

            <Link href="/auth/register">
              <Button
                outline
                gradientDuoTone="greenToBlue"
                className="font-medium rounded-lg hover:scale-105 transition-transform dark:border-gray-600"
              >
                Registrasi
              </Button>
            </Link>

            {/* Tombol Dark Mode Minimalis */}
            {mounted && (
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
            )}
          </div>

          {/* Mobile Toggle Button */}
          <Navbar.Toggle className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700" />
        </div>
      </div>

      {/* Mobile Menu */}
      <Navbar.Collapse className="md:hidden">
        <div className="flex flex-col gap-4 mt-4 items-center">
          {mounted && (
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
          )}
          <Link href="/auth/register" className="w-full">
            <Button
              outline
              gradientDuoTone="greenToBlue"
              className="w-full font-medium rounded-lg hover:scale-105 transition-transform dark:border-gray-600"
            >
              Registrasi
            </Button>
          </Link>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
