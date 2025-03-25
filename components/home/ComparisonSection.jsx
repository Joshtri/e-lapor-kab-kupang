"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import {
  HiOutlineGlobe,
  HiOutlineDocumentReport,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineLightBulb,
  HiOfficeBuilding,
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
} from "react-icons/hi"

export default function ComparisonSection() {
  const driverObj = useRef(null)

  useEffect(() => {
    driverObj.current = driver({
      showProgress: true,
      nextBtnText: "Selanjutnya",
      prevBtnText: "Sebelumnya",
      doneBtnText: "Selesai",
      steps: [
        {
          element: "#online-process",
          popover: {
            title: "Pengaduan Online",
            description: "Pengaduan secara digital lebih cepat & efisien.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#offline-process",
          popover: {
            title: "Pengaduan Offline",
            description: "Pengaduan langsung ke kantor pemerintah.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#start-online",
          popover: {
            title: "Daftar Akun",
            description: "Buat akun terlebih dahulu untuk memulai laporan online.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#start-offline",
          popover: {
            title: "Datang ke Kantor",
            description: "Kunjungi kantor terdekat dan isi formulir laporan.",
            side: "left",
            align: "start",
          },
        },

        {
          element: "#login-buat-laporan",
          popover: {
            title: "Login & Buat Laporan",
            description: "Masuk dan buat laporan dengan detail yang jelas.",
            side: "left",
            align: "start",
          },
        },

        {
          element: "#isi-formulir",
          popover: {
            title: "Isi Formulir",
            description: "Isi formulir pengaduan yang disediakan.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#verifikasi-otomatis",
          popover: {
            title: "Verifikasi dua Pihak",
            description: "Verifikasi laporan dilakukan oleh OPD yang anda tunjuk dan bupati",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#verifikas-petugas",
          popover: {
            title: "Verifikasi Petugas",
            description: "Petugas akan memverifikasi identitas & laporan Anda.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#tindak-lanjut",
          popover: {
            title: "Tindak Lanjut",
            description: "Laporan akan diperiksa dan respon oleh OPD terkait dan Bupati.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#penyaluran-laporan",
          popover: {
            title: "Penyaluran Laporan",
            description: "Laporan diteruskan ke OPD terkait.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#pantau-terus",
          popover: {
            title: "Pantau Status",
            description: "Pantau status laporan Anda di dashboard.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#konfirmasi-telepon",
          popover: {
            title: "Konfirmasi Telepon",
            description: "Anda akan mendapat konfirmasi melalui telepon/WA atau SMS.",
            side: "left",
            align: "start",
          },
        },
      ],
    })
  }, [])

  const startTour = () => {
    if (driverObj.current) {
      driverObj.current.drive()
    }
  }

  const onlineSteps = [
    {
      id: "start-online",
      title: "Daftar Akun",
      description: "Buat akun di platform LAPOR KK BUPATI.",
      icon: HiOutlineMail,
    },
    {
      id: "login-buat-laporan",
      title: "Login & Buat Laporan",
      description: "Masuk dan buat laporan dengan detail yang jelas.",
      icon: HiOutlineDocumentReport,
    },
    {
      id: "verifikasi-otomatis",
      title: "Verifikasi Otomatis",
      description: "Sistem akan memverifikasi laporan Anda.",
      icon: HiMailOpen,
    },
    {
      id: "tindak-lanjut",
      title: "Tindak Lanjut",
      description: "Laporan diteruskan ke OPD terkait.",
      icon: HiPaperAirplane,
    },
    {
      id: "pantau-terus",
      title: "Pantau Status",
      description: "Pantau status laporan Anda di dashboard.",
      icon: HiOutlineCheckCircle,
    },
  ]

  const offlineSteps = [
    {
      id: "start-offline",
      title: "Kunjungi Kantor",
      description: "Datang ke kantor atau OPD terdekat.",
      icon: HiOutlineGlobe,
    },
    {
      id: "isi-formulir",
      title: "Isi Formulir",
      description: "Isi formulir pengaduan yang disediakan.",
      icon: HiOutlineDocumentReport,
    },
    {
      id: "verifikas-petugas",
      title: "Verifikasi Petugas",
      description: "Petugas akan memverifikasi identitas Anda.",
      icon: HiOutlineCheckCircle,
    },
    {
      id: "penyaluran-laporan",
      title: "Penyaluran Laporan",
      description: "Laporan diteruskan ke OPD terkait.",
      icon: HiOutlineClock,
    },
    {
      id: "konfirmasi-telepon",
      title: "Konfirmasi Telepon",
      description: "Anda akan mendapat konfirmasi melalui telepon/SMS.",
      icon: HiOutlinePhone,
    },
  ]

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <HiOutlineMail className="text-blue-600 h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Alur Pengaduan Online vs Offline</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Pilih jalur pengaduan yang paling cocok buat kamu! Mau online yang cepat & praktis, atau lebih nyaman dengan
            offline? Yuk, cek alurnya!
          </p>
          <div className="text-center my-10">
            <motion.button
              onClick={startTour}
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiOutlineLightBulb className="h-5 w-5" />
              Mulai Tour Interaktif
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Online Process - Styled like mail delivery */}
          <motion.div
            id="online-process"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Mail delivery path */}
            <div className="absolute top-0 bottom-0 left-12 w-1 bg-blue-200 border-l border-r border-dashed border-blue-300"></div>

            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 text-blue-600 mb-4 border-2 border-blue-200"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <HiOutlineMail className="h-12 w-12" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Pengaduan Online</h3>
              <p className="text-sm text-gray-600 mt-2">Cepat, Mudah, dan Efisien</p>
            </div>

            {onlineSteps.map((step, index) => (
              <div key={index} id={step.id} className="relative pl-20 pb-8">
                <div className="absolute left-0 w-24 flex items-center justify-center">
                  <motion.div
                    className="z-10 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  >
                    {index + 1}
                  </motion.div>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <step.icon className="h-6 w-6 text-blue-500 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Offline Process */}
          <motion.div
            id="offline-process"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Traditional mail path */}
            <div className="absolute top-0 bottom-0 left-12 w-1 bg-yellow-200 border-l border-r border-dashed border-yellow-300"></div>

            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 text-yellow-600 mb-4 border-2 border-yellow-200"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <HiOfficeBuilding className="h-12 w-12" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Pengaduan Offline</h3>
              <p className="text-sm text-gray-600 mt-2">Tatap Muka Langsung</p>
            </div>

            {offlineSteps.map((step, index) => (
              <div key={index} id={step.id} className="relative pl-20 pb-8">
                <div className="absolute left-0 w-24 flex items-center justify-center">
                  <motion.div
                    className="z-10 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  >
                    {index + 1}
                  </motion.div>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <step.icon className="h-6 w-6 text-yellow-500 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

