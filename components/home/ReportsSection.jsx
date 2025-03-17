"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "flowbite-react"
import { motion } from "framer-motion"
import CtaSection from "./CtaSection"


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
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Laporan Terbaru</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <Image src="https://placehold.co/600x400" alt={report.title} fill className="object-cover"  dangerouslyAllowSVG={true}/>
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {report.status}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-1">
                    {report.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{report.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{report.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Laporan ini telah ditindaklanjuti oleh OPD terkait dan telah diselesaikan dengan baik.
                </p>
                <Button size="sm" color="light" className="w-full">
                  Lihat Detail
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <CtaSection/>

        {/* <div className="text-center mt-10">
          <Link href="/reports">
            <Button color="blue" outline>
              Lihat Semua Laporan
            </Button>
          </Link>
        </div> */}
      </div>
    </div>
  )
}

