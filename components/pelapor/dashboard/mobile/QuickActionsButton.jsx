"use client"

import { Card, Button } from "flowbite-react"
import { HiPlus, HiOutlineDocumentText, HiOutlineChatAlt2, HiExclamationCircle } from "react-icons/hi"
import { FaWhatsapp } from "react-icons/fa"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import useSWR from "swr"



const fetcher = (url) => fetch(url).then((res) => res.json())

const QuickActionsMobile = ({ setOpenModal, handleWhatsApp }) => {
  const router = useRouter()

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

  const { data } = useSWR("/api/pelapor/chat/bupati/unread-count", fetcher, {
    refreshInterval: 10000, // refresh tiap 10 detik
  })
  const unreadCount = data?.unreadCount || 0

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Aksi Cepat</h3>

      <motion.div className="grid grid-cols-2 gap-3 mb-4" variants={container} initial="hidden" animate="show">
        {/* Buat Laporan */}
        <motion.div variants={item}>
          <Button
            onClick={() => setOpenModal(true)}
            color="blue"
            className="h-20 w-full flex flex-col items-center justify-center"
          >
            <HiPlus className="h-6 w-6 mb-1" />
            <span className="text-xs">Buat Laporan</span>
          </Button>
        </motion.div>

        {/* WhatsApp */}
        <motion.div variants={item}>
          <Button
            onClick={handleWhatsApp}
            color="success"
            className="h-20 w-full flex flex-col items-center justify-center"
          >
            <FaWhatsapp className="h-6 w-6 mb-1" />
            <span className="text-xs">WhatsApp</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Additional Actions */}
      <motion.div className="grid grid-cols-1 gap-3" variants={container} initial="hidden" animate="show">
        {/* Log Laporan */}
        <motion.div variants={item}>
          <Link href="/pelapor/log-laporan" passHref>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-3">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                    <HiOutlineDocumentText className="text-green-600 dark:text-green-400 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Log Laporan</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Lihat riwayat laporan Anda</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Chat Bupati */}
        <motion.div variants={item}>
          <Link href="/pelapor/chat/bupati" passHref>
            <Card className="hover:shadow-md transition-shadow cursor-pointer relative">
              {unreadCount > 0 && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                </div>
              )}
              <div className="p-3">
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                    <HiOutlineChatAlt2 className="text-purple-600 dark:text-purple-400 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Chat Bupati</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Pesan langsung ke Bupati</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Chat OPD */}
        <motion.div variants={item}>
          <Link href="/pelapor/chat/opd" passHref>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-3">
                <div className="flex items-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3">
                    <HiOutlineChatAlt2 className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Chat OPD</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Kirim pesan ke OPD terkait</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Laporkan Bug */}
        <motion.div variants={item}>
          <Link href="/pelapor/lapor-bug/create" passHref>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-3">
                <div className="flex items-center">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                    <HiExclamationCircle className="text-red-600 dark:text-red-400 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Laporkan Bug</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Laporkan masalah teknis</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default QuickActionsMobile
