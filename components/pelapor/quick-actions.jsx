'use client';

import { Card } from 'flowbite-react';
import {
  HiPlus,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlineChatAlt2,
  HiExclamationCircle,
} from 'react-icons/hi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import CornerDot from '../CornerDot';

const fetcher = (url) => fetch(url).then((res) => res.json());

const QuickActions = ({ setOpenModal }) => {
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const { data } = useSWR('/api/pelapor/chat/bupati/unread-count', fetcher, {
    refreshInterval: 10000, // refresh tiap 10 detik
  });
  const unreadCount = data?.unreadCount || 0;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <HiOutlineMail className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        Aksi Cepat
      </h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Buat Laporan */}
        <motion.div variants={item}>
          <Card
            className="border-l-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
            onClick={() => setOpenModal(true)}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4 relative">
                <HiPlus className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                <CornerDot color="blue" animate />

                {/* <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"></div> */}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Buat Laporan
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Laporkan masalah yang Anda alami.
                </p>
                <button
                  className="mt-3 text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
                  onClick={() => setOpenModal(true)}
                >
                  <HiPaperAirplane className="mr-1 h-4 w-4" />
                  Buat Laporan Baru
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Log Laporan */}
        <motion.div variants={item}>
          <Link href="/pelapor/log-laporan" passHref>
            <Card className="border-l-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4 relative">
                  <HiOutlineDocumentText className="text-green-600 dark:text-green-400 h-6 w-6" />
                  <CornerDot color="green" animate />

                  {/* <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></div> */}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Log Laporan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Lihat riwayat laporan Anda.
                  </p>
                  <span className="mt-3 text-green-600 dark:text-green-400 font-medium flex items-center hover:underline">
                    <HiMailOpen className="mr-1 h-4 w-4" />
                    Lihat Semua Laporan
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Chat Bupati */}
        <motion.div variants={item}>
          <Link href="/pelapor/chat/bupati" passHref>
            <Card className="border-l-4 border-purple-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
              {unreadCount > 0 && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-600 rounded-full shadow-lg ring-2 ring-white dark:ring-gray-800">
                    {unreadCount > 10 ? '10+' : unreadCount}
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4 relative">
                  <HiOutlineChatAlt2 className="text-purple-600 dark:text-purple-400 h-6 w-6" />
                  <CornerDot color="purple" animate />
                  {/* <div className="absolute -top-1 -right-1 h-2 w-2 bg-purple-500 rounded-full"></div> */}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Chat Bupati
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Sampaikan pesan langsung ke Bupati.
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Chat OPD */}
        <motion.div variants={item}>
          <Link href="/pelapor/chat/opd" passHref>
            <Card className="border-l-4 border-indigo-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4 relative">
                  <HiOutlineChatAlt2 className="text-indigo-600 dark:text-indigo-400 h-6 w-6" />
                  <CornerDot color="indigo" animate />

                  {/* <div className="absolute -top-1 -right-1 h-2 w-2 bg-indigo-500 rounded-full"></div> */}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Chat OPD
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Kirim pesan ke OPD terkait.
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 flex items-center">
        <HiExclamationCircle className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
        Laporan Sistem
      </h2>
      {/* Laporkan Bug */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Laporkan Bug */}
        <motion.div variants={item}>
          <Link href="/pelapor/lapor-bug/create" passHref>
            <Card className="border-l-4 border-red-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4 relative">
                  <HiExclamationCircle className="text-red-600 dark:text-red-400 h-6 w-6" />
                  <CornerDot color="red" animate />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Laporkan Bug
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Laporkan masalah teknis yang Anda temui.
                  </p>
                  <span className="mt-3 text-red-600 dark:text-red-400 font-medium flex items-center hover:underline">
                    <HiExclamationCircle className="mr-1 h-4 w-4" />
                    Mulai Laporan Bug
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Daftar Bug */}
        <motion.div variants={item}>
          <Link href="/pelapor/lapor-bug" passHref>
            <Card className="border-l-4 border-orange-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
              <div className="flex items-start">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4 relative">
                  <HiOutlineDocumentText className="text-orange-600 dark:text-orange-400 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Daftar Laporan Bug
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Lihat riwayat bug yang telah Anda laporkan.
                  </p>
                  <span className="mt-3 text-orange-600 dark:text-orange-400 font-medium flex items-center hover:underline">
                    <HiMailOpen className="mr-1 h-4 w-4" />
                    Lihat Semua Bug
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuickActions;
