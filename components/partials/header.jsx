"use client";

import React, { useEffect, useState } from "react";
import { Button, Navbar } from "flowbite-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BsMoonStarsFill, BsSunFill, BsArrowDownUp } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import FloatingNavbarButton from "@/components/floating-navbar-button"; // ✅ Import Floating Button

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50 && currentScrollY > scrollY) {
        setShowNavbar(false);
        setShowFloatingButton(true);
      } else {
        setShowNavbar(true);
        setShowFloatingButton(false);
      }

      if (currentScrollY < 50) {
        setShowFloatingButton(false);
      }

      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return (
    <>
      {/* Navbar dengan efek slide up saat scroll */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: showNavbar ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed w-full z-50 top-0 bg-white dark:bg-gray-800 shadow-lg py-4 px-6"
      >
        <Navbar fluid rounded>
          <Navbar.Brand as={Link} href="/" className="flex items-center gap-3">
            <img src="/logo-kab-kupang.png" alt="Logo Lembaga" className="w-10 h-10" />
            <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
              Lapor KK BUPATI
            </span>
          </Navbar.Brand>

          <div className="flex md:order-2">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-black dark:text-gray-100">Beranda</Link>
              <Link href="/auth/register">
                <Button outline gradientduotone="greenToBlue" className="font-medium rounded-lg">
                  Registrasi
                </Button>
              </Link>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === "light" ? <BsMoonStarsFill className="text-lg text-gray-700" /> : <BsSunFill className="text-lg text-yellow-400" />}
                </button>
              )}
            </div>
            <Navbar.Toggle className="md:hidden" />
          </div>

          <Navbar.Collapse className="md:hidden">
            <div className="flex flex-col gap-4 mt-4 items-center">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === "light" ? <BsMoonStarsFill className="text-lg text-gray-700" /> : <BsSunFill className="text-lg text-yellow-400" />}
                </button>
              )}
              <Link href="/auth/register" className="w-full">
                <Button outline gradientduotone="greenToBlue" className="w-full font-medium rounded-lg">
                  Registrasi
                </Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </motion.nav>

      {/* Floating Button untuk menampilkan Navbar kembali */}
      {/* ✅ Floating Button Komponen */}
      <FloatingNavbarButton onShowNavbar={() => setShowNavbar(true)} showButton={showFloatingButton} />
    </>
  );
}
