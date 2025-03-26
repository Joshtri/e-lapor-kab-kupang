'use client';

import React, { useState, useEffect } from 'react';
import TabsComponent from '@/components/ui/tabs-group'; // ✅ Import Tabs
import DashboardStats from '@/components/admin/dashboard/dashboard-stats'; // ✅ Statistik
import DashboardChart from '@/components/admin/dashboard/dashboard-chart'; // ✅ Grafik
import DashboardReports from '@/components/admin/dashboard/dashboard-latest-reports'; // ✅ Laporan
import axios from 'axios';
import DashboardKinerjaOpd from './dashboard/DashboardKinerjaOpd';
import { motion } from "framer-motion"
import { HiOutlineMail } from "react-icons/hi"

const AdminDashboard = ({titleHeader}) => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);
      setLoadingChart(true);
      setLoadingReports(true);

      const [statsRes, chartRes, categoryRes, reportsRes] = await Promise.all([
        axios.get('/api/reports/stats/admin-summary'),
        axios.get('/api/reports/stats/chart'),
        axios.get('/api/reports/stats/category'),
        axios.get('/api/reports/stats/recent-reports'),
      ]);

      setStats(statsRes.data.stats);
      setChartData(chartRes.data.chartData);
      setCategoryStats(categoryRes.data.categoryStats);
      setRecentReports(reportsRes.data.recentReports);
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    } finally {
      setLoadingStats(false);
      setLoadingChart(false);
      setLoadingReports(false);
    }
  };

 
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

export default AdminDashboard;
