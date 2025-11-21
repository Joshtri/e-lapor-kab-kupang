'use client';

import TabsComponent from '@/components/ui/TabsGroup';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { HiOutlineMail } from 'react-icons/hi';
import { motion } from 'framer-motion';
import StatsReportByDailyCategory from './stats/StatsReportByDailyCategory';
import StatsReportByDay from './stats/StatsReportByDay';
import StatsReportByMonth from './stats/StatsReportByMonth';
import StatsReportByPriority from './stats/StatsReportByPriority';
import StatsReportTableByCategory from './stats/StatsReportTableByCategory';
import {
  fetchPriorityStats,
  fetchDailyReportStats,
} from '@/services/dashboardService';

import PropTypes from 'prop-types';

const DashboardChart = ({ categoryStats, chartData, loading }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  // Fetch priority stats using TanStack Query
  const { data: priorityStats = [], isLoading: loadingPriority } = useQuery({
    queryKey: ['priorityStats'],
    queryFn: fetchPriorityStats,
    onError: () => {
      toast.error('Gagal mengambil data prioritas laporan.');
    },
  });

  // Fetch daily report stats using TanStack Query with month dependency
  const { data: dailyReportStats = [], isLoading: loadingDaily } = useQuery({
    queryKey: ['dailyReportStats', selectedMonth],
    queryFn: () => fetchDailyReportStats(selectedMonth),
    onError: () => {
      toast.error('Gagal mengambil data laporan harian.');
    },
  });

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mail-themed header */}
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <HiOutlineMail className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Analisis Laporan
        </h2>
      </div>

      <TabsComponent
        tabs={[
          {
            title: 'Statistik Laporan (Per Bulan)',
            content: (
              <StatsReportByMonth chartData={chartData} isLoading={loading} />
            ),
          },
          {
            title: 'Statistik Laporan (Per Hari)',
            content: (
              <StatsReportByDay
                dailyReportStats={dailyReportStats}
                loadingDaily={loading}
                handleMonthChange={handleMonthChange}
                selectedMonth={selectedMonth}
              />
            ),
          },
          {
            title: 'Statistik Prioritas',
            content: (
              <StatsReportByPriority
                priorityStats={priorityStats}
                loadingPriority={loadingPriority}
              />
            ),
          },
          {
            title: 'Statistik Laporan Harian By Kategori',
            content: <StatsReportByDailyCategory />,
          },
        ]}
      />

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* 📊 Statistik Berdasarkan Kategori */}
      <StatsReportTableByCategory categoryStats={categoryStats} />
    </motion.div>
  );
};

export default DashboardChart;

DashboardChart.propTypes = {
  categoryStats: PropTypes.array.isRequired,
  chartData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
