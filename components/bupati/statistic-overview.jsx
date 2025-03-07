"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";

const StatistikOverview = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0, // optional, jika nanti ada ditolak
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/reports/stats/admin-summary");
        setStats(response.data.stats);
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatistikCard
        title="Total Laporan"
        count={stats.totalReports}
        color="blue"
      />
      <StatistikCard title="Diproses" count={stats.inProgress} color="yellow" />
      <StatistikCard title="Selesai" count={stats.completed} color="green" />
      {/* Kalau nanti ada data 'rejected', tampilkan, kalau tidak bisa dihapus */}
      <StatistikCard title="Ditolak" count={stats.rejected || 0} color="red" />
    </div>
  );
};

const colorClasses = {
  blue: "bg-blue-100 dark:bg-blue-800",
  yellow: "bg-yellow-100 dark:bg-yellow-800",
  green: "bg-green-100 dark:bg-green-800",
  red: "bg-red-100 dark:bg-red-800",
};

const StatistikCard = ({ title, count, color }) => (
  <div className={`p-6 rounded-lg shadow-md ${colorClasses[color]}`}>
    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
      {title}
    </h2>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
  </div>
);

export default StatistikOverview;
