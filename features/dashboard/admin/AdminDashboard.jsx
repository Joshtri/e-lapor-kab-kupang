'use client';

import DashboardChart from '@/features/dashboard/admin/DashboardChart';
import DashboardReports from '@/features/dashboard/admin/DashboardLatestReports';
import DashboardStats from '@/features/dashboard/admin/DashboardStats';
import NotificationPanel from '@/components/DashboardNotificationPanel';
import TabsComponent from '@/components/ui/TabsGroup';
import DashboardKinerjaOpd from '@/features/dashboard/admin/DashboardKinerjaOpd';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineMail } from 'react-icons/hi';
import { toast } from 'sonner';
import {
  fetchDashboardStats,
  fetchChartData,
  fetchCategoryStats,
  fetchRecentReports,
} from '@/services/dashboardService';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import PropTypes from 'prop-types';

const AdminDashboard = ({ titleHeader = 'Dashboard Admin' }) => {
  // Fetch dashboard stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    onError: () => {
      toast.error('Gagal mengambil data statistik dashboard.');
    },
  });

  // Fetch chart data
  const { data: chartData = [], isLoading: loadingChart } = useQuery({
    queryKey: ['chartData'],
    queryFn: fetchChartData,
    onError: () => {
      toast.error('Gagal mengambil data grafik.');
    },
  });

  // Fetch category stats
  const { data: categoryStats = [], isLoading: loadingCategoryStats } =
    useQuery({
      queryKey: ['categoryStats'],
      queryFn: fetchCategoryStats,
      onError: () => {
        toast.error('Gagal mengambil data kategori.');
      },
    });

  // Fetch recent reports
  const { data: recentReports = [], isLoading: loadingReports } = useQuery({
    queryKey: ['recentReports'],
    queryFn: fetchRecentReports,
    onError: () => {
      toast.error('Gagal mengambil data laporan terbaru.');
    },
  });

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center">
          <motion.div
            className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4"
            animate={{ rotate: [0, 10, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: 'easeInOut',
            }}
          >
            <HiOutlineMail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {titleHeader}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Pantau semua laporan dan statistik dalam satu tempat
            </p>
          </div>
        </div>
      </div>{' '}
      <NotificationPanel />
      <LoadingScreen isLoading={loadingChart || loadingReports} />
      <TabsComponent
        tabs={[
          {
            title: 'Ikhtisar',
            content: <DashboardStats stats={stats} loading={loadingStats} />,
          },
          {
            title: 'Statistik',
            content: (
              <DashboardChart
                chartData={chartData}
                categoryStats={categoryStats}
                loading={loadingChart}
              />
            ),
          },
          {
            title: 'Laporan',
            content: (
              <DashboardReports
                reports={recentReports}
                loading={loadingReports}
              />
            ),
          },
          { title: 'Kinerja OPD', content: <DashboardKinerjaOpd /> },
        ]}
      />
    </div>
  );
};

AdminDashboard.propTypes = {
  titleHeader: PropTypes.string,
};

export default AdminDashboard;
