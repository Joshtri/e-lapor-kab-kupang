"use client";

import React, { useState } from "react";
import QuickActions from "@/components/pelapor/quick-actions";
import Statistics from "@/components/pelapor/statistics";
import ReportModal from "@/components/pelapor/CreateReportModal";
import { Button, Card } from "flowbite-react";
import { 
  HiMail, 
  HiOutlineMail, 
  HiUser, 
  HiMailOpen,
  HiHome
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const DashboardPelapor = ({ user }) => {
  const [openModal, setOpenModal] = useState(false);

  const [refetchStats, setRefetchStats] = useState(0);

const handleRefetch = () => {
  setRefetchStats((prev) => prev + 1); // ganti trigger
};

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Halo KK Yos & Sis Arumi,\n\nNIK: \nNAMA: \nAlamat: \n\nSaya ingin melaporkan\n\nDeskripsi Laporan: \n\nTerima kasih. UIS NENO NOKAN KIT.",
    );
    window.open(`https://wa.me/6281237159777?text=${message}`, "_blank");
  };
  
  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card - Styled like an envelope */}
        <Card className="mb-8 border-t-8 border-blue-500 shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <HiUser className="text-blue-600 h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Selamat Datang,{" "}
                  <span className="font-bold text-blue-600">
                    {user?.name}
                  </span>
                </h1>
                <p className="text-gray-600 mt-1 flex items-center dark:text-gray-200">
                  <HiHome className="mr-2 h-4 w-4" />
                  Dashboard pelapor Lapor KK Bupati
                </p>
              </div>
            </div>

            {/* WhatsApp Button */}
            <Button
              color="success"
              size="md"
              className="flex items-center gap-2 shadow-sm"
              onClick={handleWhatsApp}
            >
              <FaWhatsapp className="text-lg" />
              Hubungi via WhatsApp
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <QuickActions setOpenModal={setOpenModal} />

        {/* Statistics */}
        <Statistics user={user} triggerRefetch={refetchStats} />

        {/* Report Modal */}
        <ReportModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          user={user}
          onSuccess={handleRefetch}
        />
      </div>
    </div>
  );
};

export default DashboardPelapor;