"use client";

import React from "react";
import { Card } from "flowbite-react";
import { HiOutlineClipboardList, HiOutlinePlusCircle } from "react-icons/hi";
import Link from "next/link";
import { FaThList } from "react-icons/fa";

const QuickActions = ({ setOpenModal }) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        className="p-4 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        <div className="flex items-center space-x-4">
          <HiOutlinePlusCircle className="text-blue-500 text-4xl" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Buat Laporan</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Laporkan masalah yang Anda alami.</p>
          </div>
        </div>
      </Card>

      <Link href="/status-laporan">
        <Card className="p-4 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition">
          <div className="flex items-center space-x-4">
            <HiOutlineClipboardList className="text-green-500 text-4xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cek Status</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lihat status laporan Anda.</p>
            </div>
          </div>
        </Card>
      </Link>

      <Link href="/pelapor-log-laporan">
        <Card className="p-4 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition">
          <div className="flex items-center space-x-4">
            <FaThList className="text-green-500 text-4xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Log Laporan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lihat riwayat laporan Anda.</p>
            </div>
          </div>
        </Card>
      </Link>

    </div>
  );
};

export default QuickActions;
