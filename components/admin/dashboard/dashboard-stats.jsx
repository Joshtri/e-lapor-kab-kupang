"use client";

import React from "react";
import { Spinner } from "flowbite-react";
import StatCard from "@/components/ui/stat-card";
import {
  FaClipboardList, FaUserFriends, FaCheckCircle, FaTimesCircle,
  FaComments, FaUserShield, FaUserTie,
} from "react-icons/fa";

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="col-span-4 flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 📊 Statistik Umum */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">📊 Statistik Umum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaClipboardList />} color="text-blue-500" title="Total Laporan" value={stats.totalReports} />
          <StatCard icon={<FaCheckCircle />} color="text-green-500" title="Selesai" value={stats.completed} />
          <StatCard icon={<FaTimesCircle />} color="text-red-500" title="Ditolak" value={stats.rejected} />
          <StatCard icon={<FaComments />} color="text-gray-700" title="Total Komentar" value={stats.totalComments} />
        </div>
      </div>

      {/* 👥 Statistik Pengguna */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">👥 Statistik Pengguna</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaUserFriends />} color="text-purple-500" title="Total Pengguna" value={stats.totalUsers} />
          <StatCard icon={<FaUserShield />} color="text-orange-500" title="Total Admin" value={stats.totalAdmin} />
          <StatCard icon={<FaUserTie />} color="text-blue-700" title="Total Bupati" value={stats.totalBupati} />
          <StatCard icon={<FaUserFriends />} color="text-green-700" title="Total Pelapor" value={stats.totalPelapor} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
