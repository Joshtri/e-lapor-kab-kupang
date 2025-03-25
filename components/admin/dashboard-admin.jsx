"use client";

import React, { useState, useEffect } from "react";
import TabsComponent from "@/components/ui/tabs-group"; // ✅ Import Tabs
import DashboardStats from "@/components/admin/dashboard/dashboard-stats"; // ✅ Statistik
import DashboardChart from "@/components/admin/dashboard/dashboard-chart"; // ✅ Grafik
import DashboardReports from "@/components/admin/dashboard/dashboard-latest-reports"; // ✅ Laporan
import axios from "axios";

const AdminDashboard = () => {
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
        axios.get("/api/reports/stats/admin-summary"),
        axios.get("/api/reports/stats/chart"),
        axios.get("/api/reports/stats/category"),
        axios.get("/api/reports/stats/recent-reports"),
      ]);

      setStats(statsRes.data.stats);
      setChartData(chartRes.data.chartData);
      setCategoryStats(categoryRes.data.categoryStats);
      setRecentReports(reportsRes.data.recentReports);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoadingStats(false);
      setLoadingChart(false);
      setLoadingReports(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Admin</h1>
      <TabsComponent
        tabs={[
          { title: "Ikhtisar", content: <DashboardStats stats={stats} loading={loadingStats} /> },
          { title: "Statistik", content: <DashboardChart chartData={chartData} categoryStats={categoryStats} loading={loadingChart} /> },
          { title: "Laporan", content: <DashboardReports reports={recentReports} loading={loadingReports} /> },
          // { title: "Kinerja OPD", content: <p>kinerja opd</p> },
        ]}
      />
    </div>
  );
};

export default AdminDashboard;
