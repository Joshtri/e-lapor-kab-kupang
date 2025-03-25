'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'flowbite-react';
import {
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineMail,
  HiMailOpen,
  HiClock,
  HiX,
} from 'react-icons/hi';

const Statistics = ({ user, triggerRefetch }) => {
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
        console.log('Statistik laporan:', res.data);
        setStats(res.data);
      } catch (error) {
        console.error('Gagal mengambil statistik laporan', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, triggerRefetch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-8 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600">Memuat statistik...</span>
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Laporan',
      value: stats.total,
      icon: HiOutlineMail,
      color: 'blue',
      description: 'Jumlah seluruh laporan yang telah Anda kirim',
    },
    {
      title: 'Laporan Selesai',
      value: stats.completed,
      icon: HiOutlineCheckCircle,
      color: 'green',
      description: 'Laporan yang telah selesai ditangani',
    },
    {
      title: 'Dalam Proses',
      value: stats.inProgress,
      icon: HiClock,
      color: 'yellow',
      description: 'Laporan yang sedang dalam proses penanganan',
    },
    {
      title: 'Ditolak',
      value: stats.rejected,
      icon: HiX,
      color: 'red',
      description: 'Laporan yang ditolak oleh OPD atau Bupati',
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-200">
        <HiMailOpen className="mr-2 h-5 w-5 text-blue-600" />
        Statistik Laporan Anda
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <Card
            key={item.title}
            className="border-t-4 shadow-sm overflow-hidden "
            style={{ borderTopColor: `var(--flowbite-${item.color}-500)` }}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full bg-${item.color}-100 mb-3`}>
                <item.icon className={`h-6 w-6 text-${item.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {item.title}
              </h3>
              <p
                className="text-3xl font-bold my-2"
                style={{ color: `var(--flowbite-${item.color}-600)` }}
              >
                {item.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
