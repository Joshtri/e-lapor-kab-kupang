"use client";

import React from "react";
import { Card } from "flowbite-react";
import { 
  HiPlus, 
  HiOutlineDocumentText, 
  HiOutlineMail, 
  HiMailOpen 
} from "react-icons/hi";
import Link from "next/link";

const QuickActions = ({ setOpenModal }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-200">
        <HiOutlineMail className="mr-2 h-5 w-5 text-blue-600 "  />
        Aksi Cepat
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Report Card */}
        <Card 
          className="border-l-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setOpenModal(true)}
        >
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <HiPlus className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Buat Laporan</h3>
              <p className="text-gray-600 mt-1 dark:text-gray-200">
                Laporkan masalah yang Anda alami.
              </p>
              <button 
                className="mt-3 text-blue-600 font-medium flex items-center hover:underline"
                onClick={() => setOpenModal(true)}
              >
                <HiOutlineMail className="mr-1 h-4 w-4" />
                Buat Laporan Baru
              </button>
            </div>
          </div>
        </Card>

        {/* Report Log Card */}
        <Link href="/pelapor/log-laporan" passHref>
          <Card className="border-l-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <HiOutlineDocumentText className="text-green-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Log Laporan</h3>
                <p className="text-gray-600 mt-1 dark:text-gray-200">
                  Lihat riwayat laporan Anda.
                </p>
                <span className="mt-3 text-green-600 font-medium flex items-center hover:underline">
                  <HiMailOpen className="mr-1 h-4 w-4" />
                  Lihat Semua Laporan
                </span>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;