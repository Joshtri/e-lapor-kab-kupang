"use client"

import { useRef, useState, useEffect } from "react"
import { Progress } from "flowbite-react"
import { motion } from "framer-motion"
import { HiOutlineDocumentReport, HiOutlineCheckCircle, HiOutlineClock, HiOutlineChartBar } from "react-icons/hi"



export default function StatsSection() {
  const statsRef = useRef(null)
  const [stats, setStats] = useState({
    reports: 0,
    resolved: 0,
    inProgress: 0,
    satisfaction: 0,
  })

  const targetStats = {
    reports: 1250,
    resolved: 1087,
    inProgress: 163,
    satisfaction: 92,
  }

  // Stats animation effect
  useEffect(() => {
    const isInViewport = (element) => {
      if (!element) return false
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }

    const handleScroll = () => {
      if (isInViewport(statsRef.current)) {
        const interval = setInterval(() => {
          setStats((prevStats) => {
            const newStats = { ...prevStats }
            let completed = true

            Object.keys(targetStats).forEach((key) => {
              if (newStats[key ] < targetStats[key ]) {
                const increment = Math.ceil(targetStats[key] / 50)
                newStats[key ] = Math.min(
                  newStats[key] + increment,
                  targetStats[key],
                )
                completed = false
              }
            })

            if (completed) clearInterval(interval)
            return newStats
          })
        }, 30)

        return () => clearInterval(interval)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div id="stats-section" ref={statsRef} className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Transparansi Pengaduan</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kami berkomitmen untuk transparansi dalam menangani setiap pengaduan masyarakat. Berikut adalah statistik
            pengaduan terkini:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
          >
            <div className="text-blue-600 dark:text-blue-400 mb-2">
              <HiOutlineDocumentReport className="h-10 w-10 mx-auto" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stats.reports}</h3>
            <p className="text-gray-600 dark:text-gray-300">Total Laporan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
          >
            <div className="text-green-600 dark:text-green-400 mb-2">
              <HiOutlineCheckCircle className="h-10 w-10 mx-auto" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stats.resolved}</h3>
            <p className="text-gray-600 dark:text-gray-300">Laporan Terselesaikan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
          >
            <div className="text-yellow-600 dark:text-yellow-400 mb-2">
              <HiOutlineClock className="h-10 w-10 mx-auto" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stats.inProgress}</h3>
            <p className="text-gray-600 dark:text-gray-300">Dalam Proses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
          >
            <div className="text-purple-600 dark:text-purple-400 mb-2">
              <HiOutlineChartBar className="h-10 w-10 mx-auto" />
            </div>
            <div className="flex items-center justify-center mb-2">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stats.satisfaction}%</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Tingkat Kepuasan</p>
            <Progress progress={stats.satisfaction} color="purple" className="mt-2" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

