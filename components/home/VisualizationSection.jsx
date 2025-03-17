"use client"

import { motion } from "framer-motion"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"


export default function VisualizationSection({ chartRef }) {
  // Chart data
  const pieData = [
    { name: "Infrastruktur", value: 35, color: "#3b82f6" },
    { name: "Kesehatan", value: 25, color: "#10b981" },
    { name: "Pendidikan", value: 15, color: "#8b5cf6" },
    { name: "Administrasi", value: 15, color: "#f97316" },
    { name: "Lainnya", value: 10, color: "#db2777" },
  ]

  const barData = [
    { name: "Jan", LaporanMasuk: 65, LaporanSelesai: 45 },
    { name: "Feb", LaporanMasuk: 59, LaporanSelesai: 49 },
    { name: "Mar", LaporanMasuk: 80, LaporanSelesai: 60 },
    { name: "Apr", LaporanMasuk: 81, LaporanSelesai: 71 },
    { name: "Mei", LaporanMasuk: 56, LaporanSelesai: 46 },
    { name: "Jun", LaporanMasuk: 55, LaporanSelesai: 45 },
  ]

  const barOptions = {
    margin: {
      top: 20,
      right: 30,
      left: 20,
      bottom: 5,
    },
    legend: {
      position: "top",
    },
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div
      id="visualization-section"
      ref={chartRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Visualisasi Data Pengaduan</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Berikut adalah visualisasi data pengaduan berdasarkan kategori dan perkembangan bulanan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Kategori Pengaduan</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pieData.map((entry, index) => (
                <div className="flex items-center" key={index}>
                  <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Statistik Bulanan</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={barOptions.margin}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="LaporanMasuk" fill="#8884d8" />
                  <Bar dataKey="LaporanSelesai" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          {/* <Button color="blue" outline onClick={() => window.open("/data/statistik-pengaduan.pdf", "_blank")}>
            Unduh Laporan Lengkap
          </Button> */}
        </motion.div>
      </div>


    </div>
  )
}

