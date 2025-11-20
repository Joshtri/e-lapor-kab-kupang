'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'flowbite-react';
import {
  HiOutlineCheckCircle,
  HiMailOpen,
  HiClock,
  HiX,
  HiDocumentText,
  HiExclamationCircle,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import SkeletonCardLoading from '@/components/ui/loading/SkeletonCardLoading';

const StatisticsMobile = ({ user, triggerRefetch }) => {
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
        console.error('Gagal mengambil statistik laporan', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchStats();
    }
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
    return <SkeletonCardLoading />;
  }

  const statItems = [
    {
      title: 'Total',
      value: stats.total,
      icon: HiDocumentText,
      color: 'blue',
      description: 'Total laporan',
    },
    {
      title: 'Menunggu',
      value: stats.pending,
      icon: HiClock,
      color: 'yellow',
      description: 'Sedang menunggu',
    },
    {
      title: 'Diproses',
      value: stats.inProgress,
      icon: HiExclamationCircle,
      color: 'blue',
      description: 'Dalam proses',
    },
    {
      title: 'Selesai',
      value: stats.completed,
      icon: HiOutlineCheckCircle,
      color: 'green',
      description: 'Telah selesai',
    },
  ];

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <HiMailOpen className="mr-2 h-5 w-5 text-blue-500" />
          Statistik Laporan
        </h3>
      </div>

      <motion.div
        className="grid grid-cols-2 gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {statItems.map((item) => (
          <motion.div key={item.title} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <div className="text-center p-4">
                <div className="flex justify-center mb-2">
                  <div
                    className={`p-2 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30`}
                  >
                    <item.icon
                      className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`}
                    />
                  </div>
                </div>
                <p
                  className={`text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}
                >
                  {item.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.title}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Stats */}
      <motion.div
        className="grid grid-cols-1 gap-3 mt-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.rejected > 0 && (
          <motion.div variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mr-3">
                      <HiX className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ditolak
                      </p>
                      <p className="text-lg font-bold text-red-600">
                        {stats.rejected}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {stats.canceled > 0 && (
          <motion.div variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-900/30 mr-3">
                      <HiX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dibatalkan
                      </p>
                      <p className="text-lg font-bold text-gray-600">
                        {stats.canceled}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StatisticsMobile;
