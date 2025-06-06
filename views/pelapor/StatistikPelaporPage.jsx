'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge, Tabs } from 'flowbite-react';
import {
  HiChartBar,
  HiTrendingUp,
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiXCircle,
  HiEye,
  HiDownload,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-media-query';
import axios from 'axios';
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

const StatistikPelaporPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
    canceled: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');
  const isMobile = useIsMobile();

  const fetchUserAndStats = async () => {
    try {
      setLoading(true);
      const userRes = await axios.get('/api/auth/me');
      const userData = userRes.data;
      setUser(userData);

      const [statsRes, chartRes] = await Promise.all([
        axios.get(`/api/reports/stats?userId=${userData.user.id}`),
        axios.get(
          `/api/reports/stats/chart-data?userId=${userData.user.id}&range=${timeRange}`,
        ),
      ]);

      setStats(statsRes.data);
      setChartData(chartRes.data.statusChart || []);
      setMonthlyData(chartRes.data.monthlyChart || []);
      setCategoryData(chartRes.data.categoryChart || []);
    } catch (error) {
      console.error('Gagal mengambil user/statistik:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndStats();
  }, [timeRange]); // tergantung timeRange
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <SkeletonCardLoading label="Memuat data statistik..." />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    description,
    trend,
  }) => (
    <motion.div variants={item}>
      <Card className="hover:shadow-lg transition-all duration-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/30`}
              >
                <Icon
                  className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {title}
                </p>
                <p
                  className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}
                >
                  {value}
                </p>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {trend != null && (
              <div className="text-right">
                <div
                  className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  <HiTrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {Math.abs(trend)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <motion.div
        className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-5'} gap-4`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <StatCard
          title="Total Laporan"
          value={stats.total}
          icon={HiDocumentText}
          color="blue"
          description="Semua laporan"
          trend={12}
        />
        <StatCard
          title="Menunggu"
          value={stats.pending}
          icon={HiClock}
          color="yellow"
          description="Belum diproses"
        />
        <StatCard
          title="Diproses"
          value={stats.inProgress}
          icon={HiExclamationCircle}
          color="blue"
          description="Sedang ditangani"
        />
        <StatCard
          title="Selesai"
          value={stats.completed}
          icon={HiCheckCircle}
          color="green"
          description="Telah diselesaikan"
          trend={8}
        />
        <StatCard
          title="Ditolak"
          value={stats.rejected}
          icon={HiXCircle}
          color="red"
          description="Tidak dapat diproses"
        />
      </motion.div>

      <div
        className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}
      >
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribusi Status Laporan
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
              Tren Laporan Bulanan
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
                  Statistik Laporan
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Analisis dan ringkasan laporan Anda
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
          onActiveTabChange={(i) =>
            setActiveTab(i === 0 ? 'overview' : 'detail')
          }
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

export default StatistikPelaporPage;
