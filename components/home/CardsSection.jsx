"use client"

import react from "react"

import Link from "next/link"
import { Button } from "flowbite-react"
import { motion } from "framer-motion"
import { HiOutlineUserAdd, HiOutlinePhone, HiOutlineLogin } from "react-icons/hi"


export default function CardsSection({ openWhatsAppModal }) {
  // Card styling
  const cardClass = "transform transition-all duration-500 hover:scale-105"
  const innerClass =
    "flex flex-col h-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-xl"
  const contentClass = "flex flex-col flex-grow items-center text-center gap-6"

  const iconWrapper = (bgColor, textColor, Icon) => (
    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} ${textColor}`}>
      <Icon className="h-8 w-8" />
    </div>
  )

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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Mulai Gunakan Layanan Kami</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pilih cara yang paling nyaman bagi Anda untuk menyampaikan pengaduan atau mendapatkan informasi dari
            Pemerintah Kabupaten Kupang.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Register Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={cardClass}
              id="register-card"
            >
              <div className={innerClass}>
                <div className={contentClass}>
                  {iconWrapper(
                    "bg-purple-100 dark:bg-purple-900",
                    "text-purple-600 dark:text-purple-300",
                    HiOutlineUserAdd,
                  )}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-200">Register</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Buat akun E-Lapor untuk mulai mengirimkan pengaduan, menyampaikan aspirasi, dan mendapatkan
                      informasi terkini dari Pemerintah Kabupaten Kupang.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                  <Link href="/auth/register" className="w-full">
                    <Button color="blue" size="lg" className="w-full">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cardClass}
            >
              <div className={innerClass}>
                <div className={contentClass}>
                  {iconWrapper("bg-green-100 dark:bg-green-900", "text-green-600 dark:text-green-300", HiOutlinePhone)}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-200">WhatsApp</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Hubungi kami langsung melalui WhatsApp untuk pengaduan seputar layanan publik secara praktis.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                  <Button gradientduotone="greenToBlue" size="lg" className="w-full" onClick={openWhatsAppModal}>
                    Hubungi via WhatsApp
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cardClass}
            >
              <div className={innerClass}>
                <div className={contentClass}>
                  {iconWrapper("bg-blue-100 dark:bg-blue-900", "text-blue-600 dark:text-blue-300", HiOutlineLogin)}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-200">Login</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Akses akun Anda untuk memantau status pengaduan, mendapatkan pembaruan, dan terhubung dengan
                      layanan kami.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                  <Link href="/auth/login" className="w-full">
                    <Button color="blue" size="lg" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

