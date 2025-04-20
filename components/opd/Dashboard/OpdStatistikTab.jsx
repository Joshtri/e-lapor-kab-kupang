"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, Spinner } from "flowbite-react"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { HiOutlineExclamationCircle, HiOutlineClock } from "react-icons/hi"

const COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#6366F1", // indigo
  "#EC4899", // pink
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
}

export default function OpdStatistikTab() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/reports/stats/chart/opd-chart")
      const result = res.data?.data || res.data
      setData(result)
    } catch (err) {
      console.error("Gagal fetch data statistik OPD", err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (loading || !data) {
    return (
      <div className="h-[300px] flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    )
  }

  const distribusiPrioritasArray = Object.entries(data.distribusiPrioritas || {}).map(([priority, jumlah]) => ({
    priority,
    jumlah,
  }))

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow transition-shadow duration-300">
          <h5 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Jumlah Laporan per Bulan</h5>
          <div className="h-[300px]">
            {data.laporanPerBulan?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.laporanPerBulan} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="bulan"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="jumlah"
                    name="Jumlah Laporan"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada data laporan per bulan.</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow transition-shadow duration-300">
            <h5 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Distribusi Kategori Laporan</h5>
            <div className="h-[300px]">
              {data.kategoriDistribusi?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.kategoriDistribusi}
                      dataKey="jumlah"
                      nameKey="kategori"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => entry.kategori}
                      animationDuration={1500}
                    >
                      {data.kategoriDistribusi.map((entry, index) => (
                        <Cell key={`cell-kategori-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada data kategori laporan.</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow transition-shadow duration-300">
            <h5 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Distribusi Prioritas Laporan</h5>
            <div className="h-[300px]">
              {distribusiPrioritasArray.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribusiPrioritasArray}
                      dataKey="jumlah"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => {
                        const labels = {
                          HIGH: "Tinggi",
                          MEDIUM: "Sedang",
                          LOW: "Rendah",
                        }
                        return labels[entry.priority] || entry.priority
                      }}
                      animationDuration={1500}
                    >
                      {distribusiPrioritasArray.map((entry, index) => {
                        // Custom colors for priority levels
                        const priorityColors = {
                          HIGH: "#EF4444", // red
                          MEDIUM: "#F59E0B", // amber
                          LOW: "#10B981", // green
                        }
                        const color = priorityColors[entry.priority] || COLORS[index % COLORS.length]
                        return <Cell key={`cell-priority-${index}`} fill={color} />
                      })}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      formatter={(value) => {
                        const labels = {
                          HIGH: "Tinggi",
                          MEDIUM: "Sedang",
                          LOW: "Rendah",
                        }
                        return labels[value] || value
                      }}
                      wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada data prioritas laporan.</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="bg-orange-50 dark:bg-orange-900/20 border-0 shadow-sm hover:shadow transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-800/30 rounded-full">
                <HiOutlineExclamationCircle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h5 className="text-lg font-medium text-gray-800 dark:text-white">Laporan Tertunda &gt; 7 Hari</h5>
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                  {data.laporanTertundaLebih7Hari ?? 0}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Laporan yang belum ditangani lebih dari 7 hari
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-0 shadow-sm hover:shadow transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-800/30 rounded-full">
                <HiOutlineClock className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h5 className="text-lg font-medium text-gray-800 dark:text-white">Waktu Rata-rata Penanganan</h5>
                <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                  {typeof data.avgHandlingTime === "number" ? `${data.avgHandlingTime} hari` : "-"}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Rata-rata waktu penyelesaian laporan</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
