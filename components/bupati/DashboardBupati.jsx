'use client';

import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import StatCard from '@/components/ui/StatCard';
import { fetchDashboardStats } from '@/services/dashboardService';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiOutlineClock,
  HiOutlineMail,
  HiOutlineUserGroup,
  HiXCircle,
} from 'react-icons/hi';
import { toast } from 'sonner';

const BupatiDashboard = () => {
  // Fetch dashboard stats using TanStack Query
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    onError: () => {
      toast.error('Gagal mengambil data dashboard.');
    },
  });

  if (loadingStats) {
    return (
      <div className="p-6">
        {/* <LoadingMail /> */}
        <LoadingScreen isLoading={loadingStats} />
      </div>
    );
  }

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center">
          <motion.div
            className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4"
            animate={{ rotate: [0, 10, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: 'easeInOut',
            }}
          >
            <HiOutlineMail className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Dashboard Bupati
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Ringkasan laporan dan statistik pengguna
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <StatCard
            icon={<HiOutlineMail className="h-6 w-6" />}
            color="text-blue-500"
            title="Total Laporan"
            value={stats?.totalReports || 0}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            icon={<HiOutlineClock className="h-6 w-6" />}
            color="text-yellow-500"
            title="Sedang Diproses"
            value={stats?.inProgress || 0}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            icon={<HiCheckCircle className="h-6 w-6" />}
            color="text-green-500"
            title="Selesai"
            value={stats?.completed || 0}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            icon={<HiXCircle className="h-6 w-6" />}
            color="text-red-500"
            title="Ditolak"
            value={stats?.rejected || 0}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            icon={<HiOutlineUserGroup className="h-6 w-6" />}
            color="text-purple-500"
            title="Total Pengguna"
            value={stats?.totalUsers || 0}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BupatiDashboard;
