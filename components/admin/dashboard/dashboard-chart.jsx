"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
import TabsComponent from "@/components/ui/tabs-group";
import StatsReportByMonth from "./stats/stats-report-by-month";
import StatsReportByDay from "./stats/stats-report-by-day";
import StatsReportTableByCategory from "./stats/stats-report-table-by-category";
import StatsReportByPriority from "./stats/stats-report-by-priority";
import StatsReportByDailyCategory from "./stats/stats-report-by-daily-category";

const DashboardChart = ({ categoryStats, chartData, loading }) => {
  const [priorityStats, setPriorityStats] = useState([]);
  const [loadingPriority, setLoadingPriority] = useState(true);

  const [dailyReportStats, setDailyReportStats] = useState([]);
  const [loadingDaily, setLoadingDaily] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  ); // Default: bulan ini


  useEffect(() => {

    fetchPriorityStats();
  }, []);
  const fetchPriorityStats = async () => {
    try {
      setLoadingPriority(true);
      const response = await axios.get("/api/reports/stats/chart/priority");
      setPriorityStats(response.data.priorityStats);
    } catch (error) {
      console.error("Gagal mengambil data prioritas laporan:", error);
    } finally {
      setLoadingPriority(false);
    }
  };

  // 🔽 Fungsi untuk mengubah bulan berdasarkan pilihan dropdown
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {

    fetchDailyReportStats(selectedMonth);
  }, [selectedMonth]);
  const fetchDailyReportStats = async (month) => {
    try {
      setLoadingDaily(true);
      const response = await axios.get(
        `/api/reports/stats/chart/daily?month=${month}`,
      );
      setDailyReportStats(response.data.dailyReportStats);
    } catch (error) {
      console.error("Gagal mengambil data laporan harian:", error);
    } finally {
      setLoadingDaily(false);
    }
  };

  return (
    <>

    <TabsComponent
      tabs={[
        {title: 'Statistik Laporan (Per Bulan)', content: <StatsReportByMonth chartData={chartData} isLoading={loading} />}, 
        {title: 'Statistik Laporan (Per Hari)', content : <StatsReportByDay dailyReportStats={dailyReportStats} loadingDaily={loading} handleMonthChange={handleMonthChange} selectedMonth={selectedMonth}/>},
        {title: 'Statistik Prioritas', content : <StatsReportByPriority priorityStats={priorityStats} loadingPriority={loadingPriority} />},
        { title: 'Statistik Laporan Harian By Kategori', content: <StatsReportByDailyCategory /> },

      ]}
    />



      <hr className="mt-10" />
      {/* 📊 Statistik Berdasarkan Kategori */}
      <StatsReportTableByCategory categoryStats={categoryStats} />



      {/* 📊 Statistik Berdasarkan Prioritas */}

    </>
  );
};

export default DashboardChart;
