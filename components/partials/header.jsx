'use client';

import { useEffect, useState } from 'react';
import { Button, Navbar } from 'flowbite-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import {
  HiOutlineMail,
  HiOutlineLogin,
  HiOutlineUserAdd,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import FloatingNavbarButton from '@/components/floating-navbar-button';

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return (
    <>
      {/* Navbar dengan efek slide up saat scroll */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: showNavbar ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed w-full z-50 top-0 bg-white dark:bg-gray-800 shadow-lg py-4 px-6"
      >
        <Navbar fluid rounded>
          <Navbar.Brand as={Link} href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Envelope icon as logo */}
              <div className="absolute inset-0 bg-blue-500 rounded-md transform rotate-3"></div>
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center">
                <HiOutlineMail className="text-blue-600 dark:text-blue-400 w-6 h-6" />
              </div>
            </div>
            <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
              Lapor KK BUPATI
            </span>
          </Navbar.Brand>

          <div className="flex md:order-2">
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
              {/* {mounted && (
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
              )} */}
            </div>
            <Navbar.Toggle className="md:hidden" />
          </div>

          <Navbar.Collapse className="md:hidden">
            <div className="flex flex-col gap-4 mt-4 items-center">
              <Link
                href="/"
                className="text-black dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
              >
                Beranda
              </Link>
              {/* {mounted && (
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
              )} */}
              <Link href="/auth/login" className="w-full">
                <Button
                  outline
                  color="blue"
                  className="w-full font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  <HiOutlineLogin className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Button
                  outline
                  gradientduotone="greenToBlue"
                  className="w-full font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  <HiOutlineUserAdd className="h-4 w-4" />
                  Registrasi
                </Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </motion.nav>

      {/* Floating Button untuk menampilkan Navbar kembali */}
      <FloatingNavbarButton
        onShowNavbar={() => setShowNavbar(true)}
        showButton={showFloatingButton}
      />
    </>
  );
}
