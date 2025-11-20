'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineHome,
  HiExclamationCircle,
} from 'react-icons/hi';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      {/* Background elements */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-blue-300/20 dark:bg-blue-600/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-64 h-64 bg-red-300/20 dark:bg-red-600/20 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Icon */}
        {/* <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-600/20 blur-2xl rounded-full" />
            <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 rounded-full p-8 border border-blue-200 dark:border-blue-700/50">
              <HiExclamationCircle className="w-24 h-24 text-blue-600 dark:text-blue-400" />
            </div>
          </motion.div>
        </motion.div> */}

        {/* 404 Number */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 dark:from-red-400 dark:via-red-300 dark:to-red-500 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Halaman Tidak Ditemukan
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
        >
          Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah
          dipindahkan atau dihapus. Silakan kembali ke halaman sebelumnya.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          {/* Go Back Button */}
          <motion.button
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Kembali
          </motion.button>

          {/* Home Button */}
          {/* <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
            >
              <HiOutlineHome className="w-5 h-5" />
              Ke Halaman Utama
            </Link>
          </motion.div> */}
        </motion.div>

        {/* Additional Help Links */}
        {/* <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Atau kunjungi halaman berikut:
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/auth/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
            >
              Login
            </Link>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <Link
              href="/buat-laporan"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
            >
              Buat Laporan
            </Link>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <Link
              href="/api/auth/logout"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
            >
              Logout
            </Link>
          </div>
        </motion.div> */}
      </motion.div>
    </div>
  );
}
