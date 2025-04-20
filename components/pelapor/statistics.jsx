'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'flowbite-react';
import {
  HiOutlineCheckCircle,
  HiOutlineMail,
  HiMailOpen,
  HiClock,
  HiX,
} from 'react-icons/hi';
import { motion } from 'framer-motion';

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
        setStats(res.data);
      } catch (error) {
        'Gagal mengambil statistik laporan', error;
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, triggerRefetch]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Memuat statistik...
        </span>
      </div>
    );
  }

  const statItems = [
    {
      title: 'Pending',
      value: stats.pending,
      icon: HiOutlineCheckCircle,
      color: 'blue',
      description: 'Jumlah seluruh laporan yang telah Anda kirim',
    },
    {
      title: 'Dalam Proses',
      value: stats.inProgress,
      icon: HiClock,
      color: 'yellow',
      description: 'Laporan yang sedang dalam proses penanganan',
    },
    {
      title: 'Laporan Selesai',
      value: stats.completed,
      icon: HiOutlineCheckCircle,
      color: 'green',
      description: 'Laporan yang telah selesai ditangani',
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <HiMailOpen className="mr-2 h-5 w-5 text-blue-500" />
          Statistik Laporan Anda
        </h2>
        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full font-medium">
          Total: {stats.total}
        </span>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {statItems.map((item, index) => (
          <motion.div key={item.title} variants={item}>
            <Card
              className="border-t-4 shadow-sm overflow-hidden relative"
              style={{ borderTopColor: `var(--flowbite-${item.color}-500)` }}
            >
              {/* Envelope flap decoration */}
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--flowbite-${item.color}-400), var(--flowbite-${item.color}-600))`,
                }}
              ></div>

              <div className="flex flex-col items-center text-center">
                <div
                  className={`p-3 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30 mb-3 relative`}
                >
                  <item.icon
                    className={`h-6 w-6 text-${item.color}-600 dark:text-${item.color}-400`}
                  />

                  {/* Stamp-like decoration */}
                  <div
                    className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: `var(--flowbite-${item.color}-500)`,
                    }}
                  ></div>
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Statistics;
