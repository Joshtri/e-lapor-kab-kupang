"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "flowbite-react"
import { motion } from "framer-motion"
import { HiMailOpen, HiPaperAirplane, HiOutlineCalendar, HiOutlineTag, HiOutlineCheckCircle } from "react-icons/hi"

export default function ReportsSection() {
  const reports = [
    {
      title: "Perbaikan Jalan Rusak di Kecamatan Kupang Tengah",
      category: "Infrastruktur",
      status: "Selesai",
      date: "15 Maret 2023",
    },
    {
      title: "Pelayanan Kesehatan di Puskesmas Oesapa",
      category: "Kesehatan",
      status: "Selesai",
      date: "22 Februari 2023",
    },
    {
      title: "Distribusi Air Bersih di Desa Oelnasi",
      category: "Layanan Publik",
      status: "Selesai",
      date: "10 Januari 2023",
    },
  ]

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <HiMailOpen className="text-blue-600 h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Laporan Terbaru</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berikut adalah beberapa laporan terbaru yang telah diselesaikan oleh Pemerintah Kabupaten Kupang.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Envelope header */}
              <div className="bg-blue-500 h-3"></div>

              <div className="h-48 bg-gray-200 relative">
                <Image src="/placeholder.svg?height=600&width=400" alt={report.title} fill className="object-cover" />
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                  {report.status}
                </div>

                {/* Stamp-like element */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-md p-2 shadow-sm transform rotate-6">
                  <div className="text-xs font-medium text-gray-800 flex items-center">
                    <HiOutlineCalendar className="mr-1 h-3 w-3" />
                    {report.date}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-3 py-1 flex items-center">
                    <HiOutlineTag className="mr-1 h-3 w-3" />
                    {report.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-gray-600 mb-4">
                  Laporan ini telah ditindaklanjuti oleh OPD terkait dan telah diselesaikan dengan baik.
                </p>

                <Button size="sm" color="light" className="w-full flex items-center justify-center gap-2">
                  <HiMailOpen className="h-4 w-4" />
                  Lihat Detail
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/reports">
            <Button color="blue" outline className="flex items-center gap-2">
              <HiPaperAirplane className="h-4 w-4" />
              Lihat Semua Laporan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

