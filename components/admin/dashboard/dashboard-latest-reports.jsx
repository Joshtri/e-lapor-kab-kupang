"use client"
import { Spinner } from "flowbite-react"
import StatusBadge from "@/components/ui/status-badge"
import Link from "next/link"
import { HiOutlineMail, HiOutlineEye } from "react-icons/hi"
import { motion } from "framer-motion"

const DashboardReports = ({ reports, loading }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg mt-8 overflow-hidden border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Envelope-like header */}
      <div className="bg-blue-500 h-2"></div>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <HiOutlineMail className="mr-2 text-blue-500" />
          Laporan Terbaru
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-3 rounded-tl-lg">#</th>
                  <th className="p-3">Pelapor</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Status Bupati</th>
                  <th className="p-3">Status Opd</th>
                  {/* <th className="p-3 rounded-tr-lg">Aksi</th> */}
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? (
                  reports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      className="border-b dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{report.pelapor}</td>
                      <td className="p-3">{report.kategori}</td>
                      <td className="p-3">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="p-3">
                        <StatusBadge status={report.statusOpd} />
                      </td>
                      <td className="p-3">
                        {/* <Link
                          href={`/adm/laporan/${report.id}`}
                          className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                          Detail
                        </Link> */}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      <div className="flex flex-col items-center py-6">
                        <HiOutlineMail className="h-12 w-12 text-gray-300 mb-2" />
                        <p>Tidak ada laporan terbaru.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default DashboardReports

