"use client"

import { motion } from "framer-motion"
import { Card, Button } from "flowbite-react"
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineLightningBolt,
} from "react-icons/hi"

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

export default function OpdIkhtisarTab({ data, onReload }) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <p className="text-gray-500 dark:text-gray-400">Gagal memuat data ikhtisar.</p>
        {onReload && (
          <Button color="blue" onClick={onReload} size="sm">
            <HiOutlineRefresh className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        )}
      </div>
    )
  }

  const statCards = [
    {
      title: "Laporan Masuk",
      value: data.totalMasuk,
      icon: <HiOutlineClipboardList className="h-5 w-5 text-blue-500" />,
      description: "Total laporan yang diterima",
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Selesai",
      value: data.totalSelesai,
      icon: <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />,
      description: "Laporan yang telah diselesaikan",
      color: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Dalam Proses",
      value: data.totalProses,
      icon: <HiOutlineClock className="h-5 w-5 text-amber-500" />,
      description: "Laporan yang sedang ditangani",
      color: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-300",
    },
    {
      title: "Ditolak",
      value: data.totalDitolak,
      icon: <HiOutlineXCircle className="h-5 w-5 text-red-500" />,
      description: "Laporan yang ditolak",
      color: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-300",
    },
  ]

  const additionalStats = [
    {
      title: "Total Pelapor",
      value: data.totalPelapor,
      icon: <HiOutlineUserGroup className="h-5 w-5 text-purple-500" />,
      description: "Jumlah pelapor unik",
      color: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    {
      title: "Laporan Baru (24 jam)",
      value: data.laporanBaru,
      icon: <HiOutlineArrowUp className="h-5 w-5 text-blue-400" />,
      description: "Laporan masuk dalam 24 jam terakhir",
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Tertunda > 7 Hari",
      value: data.laporanTertundaLebih7Hari,
      icon: <HiOutlineExclamationCircle className="h-5 w-5 text-orange-500" />,
      description: "Laporan yang belum ditangani lebih dari 7 hari",
      color: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-300",
    },
    {
      title: "Rata-rata Penanganan",
      value: data.avgHandlingTime ? `${data.avgHandlingTime} hari` : "-",
      icon: <HiOutlineClock className="h-5 w-5 text-indigo-500" />,
      description: "Rata-rata waktu penyelesaian laporan",
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-700 dark:text-indigo-300",
    },
  ]

  const priorityStats = [
    {
      title: "Prioritas Rendah",
      value: data.distribusiPrioritas?.LOW || 0,
      icon: <HiOutlineArrowDown className="h-5 w-5 text-green-500" />,
      description: "Laporan dengan prioritas rendah",
      color: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Prioritas Sedang",
      value: data.distribusiPrioritas?.MEDIUM || 0,
      icon: <HiOutlineLightningBolt className="h-5 w-5 text-amber-500" />,
      description: "Laporan dengan prioritas sedang",
      color: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-300",
    },
    {
      title: "Prioritas Tinggi",
      value: data.distribusiPrioritas?.HIGH || 0,
      icon: <HiOutlineArrowUp className="h-5 w-5 text-red-500" />,
      description: "Laporan dengan prioritas tinggi",
      color: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-300",
    },
  ]

  const StatCard = ({ stat }) => (
    <motion.div variants={item}>
      <Card className={`${stat.color} border-0 shadow-sm hover:shadow transition-shadow duration-300`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
          </div>
          <div className={`p-2 rounded-full ${stat.color}`}>{stat.icon}</div>
        </div>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Status Laporan</h3>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statCards.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </motion.div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Statistik Tambahan</h3>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {additionalStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </motion.div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Distribusi Prioritas</h3>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {priorityStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
