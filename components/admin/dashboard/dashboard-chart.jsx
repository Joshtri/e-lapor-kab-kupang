"use client"

import TabsComponent from "@/components/ui/tabs-group"
import axios from "axios"
import { useEffect, useState } from "react"
import StatsReportByDailyCategory from "./stats/stats-report-by-daily-category"
import StatsReportByDay from "./stats/stats-report-by-day"
import StatsReportByMonth from "./stats/stats-report-by-month"
import StatsReportByPriority from "./stats/stats-report-by-priority"
import StatsReportTableByCategory from "./stats/stats-report-table-by-category"
import { HiOutlineMail } from "react-icons/hi"
import { motion } from "framer-motion"

const DashboardChart = ({ categoryStats, chartData, loading }) => {
  const [priorityStats, setPriorityStats] = useState([])
  const [loadingPriority, setLoadingPriority] = useState(true)

  const [dailyReportStats, setDailyReportStats] = useState([])
  const [loadingDaily, setLoadingDaily] = useState(true)

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // Default: bulan ini

  useEffect(() => {
    fetchPriorityStats()
  }, [])

  const fetchPriorityStats = async () => {
    try {
      setLoadingPriority(true)
      const response = await axios.get("/api/reports/stats/chart/priority")
      setPriorityStats(response.data.priorityStats)
    } catch (error) {
      console.error("Gagal mengambil data prioritas laporan:", error)
    } finally {
      setLoadingPriority(false)
    }
  }

  // 🔽 Fungsi untuk mengubah bulan berdasarkan pilihan dropdown
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
  }

  useEffect(() => {
    fetchDailyReportStats(selectedMonth)
  }, [selectedMonth])

  const fetchDailyReportStats = async (month) => {
    try {
      setLoadingDaily(true)
      const response = await axios.get(`/api/reports/stats/chart/daily?month=${month}`)
      setDailyReportStats(response.data.dailyReportStats)
    } catch (error) {
      console.error("Gagal mengambil data laporan harian:", error)
    } finally {
      setLoadingDaily(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Mail-themed header */}
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <HiOutlineMail className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Analisis Laporan</h2>
      </div>

      <TabsComponent
        tabs={[
          {
            title: "Statistik Laporan (Per Bulan)",
            content: <StatsReportByMonth chartData={chartData} isLoading={loading} />,
          },
          {
            title: "Statistik Laporan (Per Hari)",
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
            title: "Statistik Prioritas",
            content: <StatsReportByPriority priorityStats={priorityStats} loadingPriority={loadingPriority} />,
          },
          { title: "Statistik Laporan Harian By Kategori", content: <StatsReportByDailyCategory /> },
        ]}
      />

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* 📊 Statistik Berdasarkan Kategori */}
      <StatsReportTableByCategory categoryStats={categoryStats} />
    </motion.div>
  )
}

export default DashboardChart

