"use client";

import React, { useState } from "react";
import QuickActions from "@/components/pelapor/quick-actions";
import Statistics from "@/components/pelapor/statistics";
import ReportModal from "@/components/pelapor/report-modal";
import { Button } from "flowbite-react";
import { FaWhatsapp } from "react-icons/fa";

const DashboardPelapor = ({ user }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo Bupati,\n\nSaya ingin menyampaikan pengaduan terkait...\n\nNama: ${user?.name}\n`
    );
    window.open(`https://wa.me/6281237159777?text=${message}`, "_blank");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Selamat Datang,{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {user?.name}
              </span>
              !
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Dashboard pelapor E-Lapor KK Bupati.
            </p>
          </div>

          {/* Tombol WhatsApp */}
          <Button
            color="success"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleWhatsApp}
          >
            <FaWhatsapp className="text-lg" />
            Hubungi via WhatsApp
          </Button>
        </div>

        {/* Fitur Cepat */}
        <QuickActions setOpenModal={setOpenModal} />

        {/* Statistik Laporan */}
        <Statistics user={user} />

        {/* Modal Buat Laporan */}
        <ReportModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          user={user}
        />
      </div>
    </div>
  );
};

export default DashboardPelapor;
