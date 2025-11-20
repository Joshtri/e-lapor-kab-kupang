'use client';

import { useState } from 'react';
import { Card, Button, Badge, Tabs } from 'flowbite-react';
import {
  HiChartBar,
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiXCircle,
  HiEye,
  HiDownload,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import SkeletonCardLoading from '@/components/ui/loading/SkeletonCardLoading';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  useCurrentUserStats,
  useUserStats,
  useUserChartData,
} from '@/services/statisticsService';
import StatCard from '@/components/ui/StatCard';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const StatistikPelapor = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const isMobile = useIsMobile();

  // Fetch current user
  const { data: user, isLoading: loadingUser } = useCurrentUserStats();

  // Fetch user statistics with caching
  const { data: stats = {}, isLoading: loadingStats } = useUserStats(user?.id);

  // Fetch chart data with caching (depends on timeRange)
  const { data: chartResponse = {}, isLoading: loadingChart } =
    useUserChartData(user?.id, timeRange);

  // Extract data from responses with defaults
  const defaultStats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
    canceled: 0,
  };

  const statsData = { ...defaultStats, ...stats };
  const chartData = chartResponse?.statusChart || [];
  const monthlyData = chartResponse?.monthlyChart || [];
  const categoryData = chartResponse?.categoryChart || [];

  // Combined loading state
  const isLoading = loadingUser || loadingStats || loadingChart;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <SkeletonCardLoading label="Memuat data statistik..." />
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      <motion.div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Pengaduan"
            value={statsData.total}
            icon={<HiDocumentText className="h-6 w-6" />}
            color="text-blue-500"
            description="Semua pengaduan"
            trend={12}
            style="detailed"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Menunggu"
            value={statsData.pending}
            icon={<HiClock className="h-6 w-6" />}
            color="text-yellow-500"
            description="Belum diproses"
            style="detailed"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Diproses"
            value={statsData.inProgress}
            icon={<HiExclamationCircle className="h-6 w-6" />}
            color="text-blue-500"
            description="Sedang ditangani"
            style="detailed"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Selesai"
            value={statsData.completed}
            icon={<HiCheckCircle className="h-6 w-6" />}
            color="text-green-500"
            description="Telah diselesaikan"
            trend={8}
            style="detailed"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Ditolak"
            value={statsData.rejected}
            icon={<HiXCircle className="h-6 w-6" />}
            color="text-red-500"
            description="Tidak dapat diproses"
            style="detailed"
          />
        </motion.div>
      </motion.div>

      <div
        className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}
      >
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribusi Status Pengaduan
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tren Pengaduan Bulanan
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="reports"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const DetailTab = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Analisis per Kategori
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ringkasan Detail
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Selesai</th>
                  <th className="px-6 py-3">Pending</th>
                  <th className="px-6 py-3">Tingkat Penyelesaian</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((cat, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {cat.category}
                    </td>
                    <td className="px-6 py-4">{cat.count}</td>
                    <td className="px-6 py-4">
                      <Badge color="green">{Math.floor(cat.count * 0.7)}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color="yellow">
                        {Math.floor(cat.count * 0.3)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `70%` }}
                          ></div>
                        </div>
                        <span className="text-sm">70%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <HiChartBar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Statistik Pengaduan
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Analisis dan ringkasan pengaduan Anda
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="1month">1 Bulan</option>
                <option value="3months">3 Bulan</option>
                <option value="6months">6 Bulan</option>
                <option value="1year">1 Tahun</option>
              </select>
              <Button color="gray" size="sm">
                <HiDownload className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs
          aria-label="Statistik tabs"
          style={{ textDecoration: 'underline' }}
        >
          <Tabs.Item active title="Ringkasan" icon={HiEye}>
            <OverviewTab />
          </Tabs.Item>
          <Tabs.Item title="Detail Analisis" icon={HiChartBar}>
            <DetailTab />
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default StatistikPelapor;
