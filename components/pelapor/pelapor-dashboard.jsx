"use client";

import React, { useState } from "react";
import QuickActions from "@/components/pelapor/quick-actions";
import Statistics from "@/components/pelapor/statistics";
import ReportModal from "@/components/pelapor/report-modal";

const DashboardPelapor = ({ user }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Selamat Datang, <span className="font-bold text-blue-600 dark:text-blue-400">{user?.name}</span>!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Dashboard pelapor E-Lapor KK Bupati.</p>

        {/* Fitur Cepat */}
        <QuickActions setOpenModal={setOpenModal} />

        {/* Statistik Laporan */}
        <Statistics  user={user}/>

        {/* Modal Buat Laporan */}
        <ReportModal openModal={openModal} setOpenModal={setOpenModal} user={user} />
      </div>
    </div>
  );
};

export default DashboardPelapor;
