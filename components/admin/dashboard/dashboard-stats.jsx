"use client"
import { Spinner } from "flowbite-react"
import StatCard from "@/components/ui/stat-card"
import {
  HiOutlineMail,
  HiMailOpen,
  HiOutlineX,
  HiOutlineChatAlt,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineUsers,
} from "react-icons/hi"
import { motion } from "framer-motion"
import LoadingMail from "@/components/ui/loading/LoadingMail"

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <LoadingMail/>
    )
  }

  // Animation variants for staggered animation
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

  return (
    <div className="space-y-8">
      {/* 📊 Statistik Umum */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <HiOutlineMail className="mr-2 text-blue-500" />
          Statistik Laporan
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <StatCard
              icon={<HiOutlineMail className="h-6 w-6" />}
              color="text-blue-500"
              title="Total Laporan"
              value={stats.totalReports}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={<HiMailOpen className="h-6 w-6" />}
              color="text-green-500"
              title="Selesai"
              value={stats.completed}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={<HiOutlineX className="h-6 w-6" />}
              color="text-red-500"
              title="Ditolak"
              value={stats.rejected}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={<HiOutlineChatAlt className="h-6 w-6" />}
              color="text-gray-700"
              title="Total Komentar"
              value={stats.totalComments}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* 👥 Statistik Pengguna */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <HiOutlineUserGroup className="mr-2 text-purple-500" />
          Statistik Pengguna
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <StatCard
              icon={<HiOutlineUserGroup className="h-6 w-6" />}
              color="text-purple-500"
              title="Total Pengguna"
              value={stats.totalUsers}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={<HiOutlineShieldCheck className="h-6 w-6" />}
              color="text-orange-500"
              title="Total Admin"
              value={stats.totalAdmin}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={<HiOutlineUserCircle className="h-6 w-6" />}
              color="text-blue-700"
              title="Total Bupati"
              value={stats.totalBupati}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              icon={<HiOutlineUsers className="h-6 w-6" />}
              color="text-green-700"
              title="Total Pelapor"
              value={stats.totalPelapor}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardStats

