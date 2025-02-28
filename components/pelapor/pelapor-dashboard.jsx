"use client";

import React from "react";
import { Card, Button } from "flowbite-react";
import {
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import Link from "next/link";

const DashboardPelapor = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-6">
      {/* Shortcut Fitur */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-10 mb-4">
        Fitur Cepat
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/buat-laporan">
          <Card className="p-5 shadow-md border-l-4 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center">
              <HiOutlinePlusCircle className="text-blue-600 dark:text-blue-400 text-5xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Buat Laporan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Laporkan masalah yang Anda alami langsung ke Bupati.
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/status-laporan">
          <Card className="p-5 shadow-md border-l-4 border-green-600 dark:border-green-400 bg-white dark:bg-gray-800 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center">
              <HiOutlineClipboardList className="text-green-600 dark:text-green-400 text-5xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Cek Status Laporan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lihat status laporan yang telah Anda buat.
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/panduan">
          <Card className="p-5 shadow-md border-l-4 border-yellow-600 dark:border-yellow-400 bg-white dark:bg-gray-800 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center">
              <HiOutlineClipboardList className="text-yellow-600 dark:text-yellow-400 text-5xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Panduan Laporan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pelajari cara melaporkan masalah dengan benar.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 mt-10">
        Dashboard Pelapor
      </h1>

      {/* Statistik Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-5 shadow-md border-l-4 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <HiOutlineDocumentText className="text-blue-500 dark:text-blue-400 text-5xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total Laporan
              </h2>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                125
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-md border-l-4 border-green-500 dark:border-green-400 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <HiOutlineCheckCircle className="text-green-500 dark:text-green-400 text-5xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Laporan Selesai
              </h2>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                98
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-md border-l-4 border-red-500 dark:border-red-400 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <HiOutlineUsers className="text-red-500 dark:text-red-400 text-5xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Laporan Dalam Proses
              </h2>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                27
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPelapor;
