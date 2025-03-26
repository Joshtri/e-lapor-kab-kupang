"use client"

import { Card } from "flowbite-react"
import { HiPlus, HiOutlineDocumentText, HiOutlineMail, HiMailOpen, HiPaperAirplane } from "react-icons/hi"
import Link from "next/link"
import { motion } from "framer-motion"

const QuickActions = ({ setOpenModal }) => {
  // Animation variants
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
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <HiOutlineMail className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        Aksi Cepat
      </h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Create Report Card */}
        <motion.div variants={item}>
          <Card
            className="border-l-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
            onClick={() => setOpenModal(true)}
          >
            {/* Envelope flap decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>

            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4 relative">
                <HiPlus className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                {/* Stamp-like decoration */}
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Buat Laporan</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Laporkan masalah yang Anda alami.</p>
                <button
                  className="mt-3 text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
                  onClick={() => setOpenModal(true)}
                >
                  <HiPaperAirplane className="mr-1 h-4 w-4" />
                  Buat Laporan Baru
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Report Log Card */}
        <motion.div variants={item}>
          <Link href="/pelapor/log-laporan" passHref>
            <Card className="border-l-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
              {/* Envelope flap decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>

              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4 relative">
                  <HiOutlineDocumentText className="text-green-600 dark:text-green-400 h-6 w-6" />
                  {/* Stamp-like decoration */}
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Log Laporan</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Lihat riwayat laporan Anda.</p>
                  <span className="mt-3 text-green-600 dark:text-green-400 font-medium flex items-center hover:underline">
                    <HiMailOpen className="mr-1 h-4 w-4" />
                    Lihat Semua Laporan
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default QuickActions

