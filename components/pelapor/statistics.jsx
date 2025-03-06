"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner } from "flowbite-react";
import {
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineCheckCircle,
} from "react-icons/hi";

const Statistics = ({ user }) => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
    canceled: 0,  
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/reports/stats?userId=${user.id}`);
        console.log("Statistik laporan:", res.data);
        setStats(res.data);
      } catch (error) {
        console.error("Gagal mengambil statistik laporan", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-4">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Memuat statistik...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Statistik Laporan Anda
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {[
          {
            title: "Total Laporan",
            value: stats.total,
            icon: HiOutlineDocumentText,
            color: "text-blue-500",
          },
          {
            title: "Laporan Selesai",
            value: stats.completed,
            icon: HiOutlineCheckCircle,
            color: "text-green-500",
          },
          {
            title: "Dalam Proses",
            value: stats.inProgress,
            icon: HiOutlineUsers,
            color: "text-yellow-500",
          },
          {
            title: "Ditolak",
            value: stats.rejected,
            icon: HiOutlineDocumentText,
            color: "text-red-500",
          },

        ].map(({ title, value, icon: Icon, color }) => (
          <Card
            key={title}
            className="p-5 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center space-x-4">
              <Icon className={`${color} text-4xl`} />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
