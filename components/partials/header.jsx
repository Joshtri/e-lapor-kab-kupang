'use client';

import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import {
  HiOutlineMail,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiOutlineHome,
  HiOutlineMenu,
  HiX,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingNavbarButton from '@/components/floating-navbar-button';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50 && currentScrollY > scrollY) {
        setShowNavbar(false);
        setShowFloatingButton(true);
        setMobileMenuOpen(false);
      } else {
        setShowNavbar(true);
        setShowFloatingButton(false);
      }

      if (currentScrollY < 50) {
        setShowFloatingButton(false);
      }

      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: showNavbar ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed w-full z-50 top-0 bg-white dark:bg-gray-800 shadow-lg"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500 rounded-md transform rotate-3"></div>
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center">
                <HiOutlineMail className="text-blue-600 dark:text-blue-400 w-6 h-6" />
              </div>
            </div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Lapor KK BUPATI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="text-black dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Beranda
            </Link>
            <Link href="/auth/login">
              <Button
                color="light"
                className="font-medium rounded-lg flex items-center gap-2 border border-gray-200 hover:bg-blue-50 transition-colors"
              >
                <HiOutlineLogin className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                outline
                gradientduotone="greenToBlue"
                className="font-medium rounded-lg flex items-center gap-2"
              >
                <HiOutlineUserAdd className="h-4 w-4" />
                Registrasi
              </Button>
            </Link>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? (
                  <BsMoonStarsFill className="text-lg text-gray-700" />
                ) : (
                  <BsSunFill className="text-lg text-yellow-400" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? (
                  <BsMoonStarsFill className="text-lg text-gray-700" />
                ) : (
                  <BsSunFill className="text-lg text-yellow-400" />
                )}
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {mobileMenuOpen ? (
                <HiX className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              ) : (
                <HiOutlineMenu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-3 space-y-3">
                <Link
                  href="/"
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HiOutlineHome className="w-5 h-5" />
                  <span>Beranda</span>
                </Link>

                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HiOutlineLogin className="w-5 h-5" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HiOutlineUserAdd className="w-5 h-5" />
                  <span>Registrasi</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Floating Button untuk menampilkan Navbar kembali */}
      <FloatingNavbarButton
        onShowNavbar={() => setShowNavbar(true)}
        showButton={showFloatingButton}
      />
    </>
  );
}
