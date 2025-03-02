"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const StatistikOverview = () => {
  const [stats, setStats] = useState({
    total: 0,
    proses: 0,
    selesai: 0,
    ditolak: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/bupati/statistik");
        setStats(response.data);
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatistikCard title="Total Laporan" count={stats.total} color="blue" />
      <StatistikCard title="Diproses" count={stats.proses} color="yellow" />
      <StatistikCard title="Selesai" count={stats.selesai} color="green" />
      <StatistikCard title="Ditolak" count={stats.ditolak} color="red" />
    </div>
  );
};

const StatistikCard = ({ title, count, color }) => (
  <div className={`p-6 rounded-lg shadow-md bg-${color}-100 dark:bg-${color}-800`}>
    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
      {title}
    </h2>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
  </div>
);

export default StatistikOverview;
