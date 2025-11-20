'use client';

import FloatingNavbarButton from '@/components/FloatingNavbarButton';
import Button from '@/components/ui/Button';
import logoApp from '@/public/fixed-logo-app.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import {
  HiOutlineHome,
  HiOutlineLogin,
  HiOutlineMenu,
  HiOutlineUserAdd,
  HiX,
} from 'react-icons/hi';

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
        className="fixed w-full z-50 top-0 bg-white dark:bg-gray-800 shadow-lg  mb-20"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src={logoApp} // simpan gambar di /public/logo-icon.png
                alt="Logo Lapor KK"
                className="object-contain rounded-md"
              />
            </div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Lapor Kaka Bupati
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
            <Button
              as="link"
              href="/auth/login"
              variant="outline"
              color="primary"
              size="md"
              startIcon={<HiOutlineLogin className="h-4 w-4" />}
            >
              Login
            </Button>
            <Button
              as="link"
              href="/auth/register"
              variant="solid"
              color="success"
              size="md"
              startIcon={<HiOutlineUserAdd className="h-4 w-4" />}
            >
              Registrasi
            </Button>
            {mounted && (
              <Button
                isIconOnly
                variant="outline"
                size="md"
                rounded="full"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? (
                  <BsMoonStarsFill className="text-lg text-gray-700" />
                ) : (
                  <BsSunFill className="text-lg text-yellow-400" />
                )}
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <Button
                isIconOnly
                variant="light"
                size="md"
                rounded="full"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? (
                  <BsMoonStarsFill className="text-lg text-gray-700" />
                ) : (
                  <BsSunFill className="text-lg text-yellow-400" />
                )}
              </Button>
            )}
            <Button
              isIconOnly
              variant="light"
              size="md"
              rounded="md"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiOutlineMenu className="w-6 h-6" />
              )}
            </Button>
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
                <Button
                  as="link"
                  href="/"
                  variant="light"
                  size="md"
                  startIcon={<HiOutlineHome className="w-5 h-5" />}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-start"
                >
                  Beranda
                </Button>

                <Button
                  as="link"
                  href="/auth/login"
                  variant="outline"
                  color="primary"
                  size="md"
                  startIcon={<HiOutlineLogin className="w-5 h-5" />}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-center"
                >
                  Login
                </Button>

                <Button
                  as="link"
                  href="/auth/register"
                  variant="solid"
                  color="success"
                  size="md"
                  startIcon={<HiOutlineUserAdd className="w-5 h-5" />}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-center"
                >
                  Registrasi
                </Button>
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
