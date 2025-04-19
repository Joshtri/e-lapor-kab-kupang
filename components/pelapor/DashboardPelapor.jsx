"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import QuickActions from "@/components/pelapor/quick-actions"
import Statistics from "@/components/pelapor/statistics"
import ReportModal from "@/components/pelapor/CreateReportModal"
import { Button, Card } from "flowbite-react"
import { HiOutlineMail, HiPaperAirplane, HiOutlineHome } from "react-icons/hi"
import { FaWhatsapp } from "react-icons/fa"
import { motion } from "framer-motion"

const DashboardPelapor = ({ user }) => {
  const searchParams = useSearchParams()
  const [openModal, setOpenModal] = useState(false)
  const [refetchStats, setRefetchStats] = useState(0)

  // Check URL params to see if we should open the modal
  useEffect(() => {
    const shouldOpenModal = searchParams.get("openModal") === "true"
    if (shouldOpenModal) {
      setOpenModal(true)

      // Clean up the URL without refreshing the page
      const url = new URL(window.location.href)
      url.searchParams.delete("openModal")
      window.history.replaceState({}, "", url)
    }
  }, [searchParams])

  const handleRefetch = () => {
    setRefetchStats((prev) => prev + 1)
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Halo KK Yos & Sis Arumi,\n\nNIK: \nNAMA: \nAlamat: \n\nSaya ingin melaporkan\n\nDeskripsi Laporan: \n\nTerima kasih. UIS NENO NOKAN KIT.",
    )
    window.open(`https://wa.me/6281237159777?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 bg-blue-50 dark:bg-gray-900 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Card - Styled like an envelope */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-8 border-t-4 border-blue-500 shadow-lg overflow-hidden relative">
            {/* Envelope flap decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4 relative">
                  <HiOutlineMail className="text-blue-600 dark:text-blue-400 h-7 w-7" />
                  {/* Stamp-like decoration */}
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Selamat Datang, <span className="font-bold text-blue-600 dark:text-blue-400">{user?.name}</span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 flex items-center">
                    <HiOutlineHome className="mr-2 h-4 w-4" />
                    Dashboard Pelapor Lapor KK Bupati
                  </p>
                </div>
              </div>

              {/* WhatsApp Button */}
              <Button color="success" size="md" className="flex items-center gap-2 shadow-sm" onClick={handleWhatsApp}>
                <FaWhatsapp className="text-lg" />
                Hubungi via WhatsApp
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Create Report Button - Mobile Only */}
        <motion.div
          className="md:hidden mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            gradientDuoTone="blueToCyan"
            className="w-full flex items-center justify-center gap-2 py-3 shadow-md"
            onClick={() => setOpenModal(true)}
          >
            <HiPaperAirplane className="h-5 w-5" />
            <span className="font-medium">Buat Laporan Baru</span>
          </Button>
        </motion.div>

        {/* Quick Actions */}
        <QuickActions setOpenModal={setOpenModal} />

        {/* Statistics */}
        <Statistics user={user} triggerRefetch={refetchStats} />

        {/* Report Modal */}
        <ReportModal openModal={openModal} setOpenModal={setOpenModal} user={user} onSuccess={handleRefetch} />

        {/* Floating Action Button - Mobile Only */}
        {/* <div className="fixed bottom-6 right-6 md:hidden z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
            onClick={() => setOpenModal(true)}
          >
            <HiPaperAirplane className="h-6 w-6" />
          </motion.button>
        </div> */}
      </div>
    </div>
  )
}

export default DashboardPelapor

