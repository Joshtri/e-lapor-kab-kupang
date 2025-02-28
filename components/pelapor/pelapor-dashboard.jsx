"use client";

import React from "react";
import { Card } from "flowbite-react";
import {
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import Link from "next/link";

const DashboardPelapor = ({ user }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Selamat Datang, <span className="font-bold text-blue-600 dark:text-blue-400">{user?.name}</span>!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Dashboard pelapor E-Lapor KK Bupati.
        </p>

        {/* Fitur Cepat */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Buat Laporan", href: "/buat-laporan", icon: HiOutlinePlusCircle, color: "text-blue-500" },
            { title: "Cek Status", href: "/status-laporan", icon: HiOutlineClipboardList, color: "text-green-500" },
            { title: "Panduan", href: "/panduan", icon: HiOutlineClipboardList, color: "text-yellow-500" },
          ].map(({ title, href, icon: Icon, color }) => (
            <Link key={title} href={href} className="group">
              <Card className="p-4 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition">
                <div className="flex items-center space-x-4">
                  <Icon className={`${color} text-4xl`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition">
                      Klik untuk lebih lanjut
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Statistik Laporan */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-10 mb-4">
          Statistik Laporan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Total Laporan", value: 125, icon: HiOutlineDocumentText, color: "text-blue-500" },
            { title: "Laporan Selesai", value: 98, icon: HiOutlineCheckCircle, color: "text-green-500" },
            { title: "Dalam Proses", value: 27, icon: HiOutlineUsers, color: "text-red-500" },
          ].map(({ title, value, icon: Icon, color }) => (
            <Card key={title} className="p-5 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-4">
                <Icon className={`${color} text-4xl`} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPelapor;
