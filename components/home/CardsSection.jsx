"use client"
import Link from "next/link"
import { Button } from "flowbite-react"
import { motion } from "framer-motion"
import {
  HiOutlineUserAdd,
  HiOutlinePhone,
  HiOutlineLogin,
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
} from "react-icons/hi"

export default function CardsSection({ openWhatsAppModal }) {
  // Card styling
  const cardClass = "transform transition-all duration-500 hover:scale-105"
  const innerClass = "flex flex-col h-full rounded-xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl"
  const contentClass = "flex flex-col flex-grow items-center text-center gap-6"

  const iconWrapper = (bgColor, textColor, Icon) => (
    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} ${textColor}`}>
      <Icon className="h-8 w-8" />
    </div>
  )

  return (
    <div className="py-20 bg-blue-50">
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
              <HiOutlineMail className="text-blue-600 h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mulai Gunakan Layanan Kami</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih cara yang paling nyaman bagi Anda untuk menyampaikan pengaduan atau mendapatkan informasi dari
            Pemerintah Kabupaten Kupang.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Register Card - Styled like an envelope */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={cardClass}
              id="register-card"
            >
              <div className={`${innerClass} border-t-4 border-purple-500 relative`}>
                {/* Envelope flap */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-purple-500 transform -translate-y-4 skew-y-1 z-0"></div>

                <div className={contentClass}>
                  {iconWrapper("bg-purple-100", "text-purple-600", HiOutlineMail)}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800">Register</h2>
                    <p className="text-gray-600">
                      Buat akun E-Lapor untuk mulai mengirimkan pengaduan, menyampaikan aspirasi, dan mendapatkan
                      informasi terkini dari Pemerintah Kabupaten Kupang.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                  <Link href="/auth/register" className="w-full">
                    <Button color="purple" size="lg" className="w-full flex items-center justify-center gap-2">
                      <HiOutlineUserAdd className="h-5 w-5" />
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp Card - Styled like an open envelope */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cardClass}
            >
              <div className={`${innerClass} border-t-4 border-green-500 relative`}>
                {/* Envelope flap open */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-green-500 transform -translate-y-4 skew-y-1 z-0"></div>

                <div className={contentClass}>
                  {iconWrapper("bg-green-100", "text-green-600", HiMailOpen)}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800">WhatsApp</h2>
                    <p className="text-gray-600">
                      Hubungi kami langsung melalui WhatsApp untuk pengaduan seputar layanan publik secara praktis.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                  <Button
                    gradientduotone="greenToBlue"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={openWhatsAppModal}
                  >
                    <HiOutlinePhone className="h-5 w-5" />
                    Hubungi via WhatsApp
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Login Card - Styled like a sent envelope */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cardClass}
            >
              <div className={`${innerClass} border-t-4 border-blue-500 relative`}>
                {/* Envelope flap */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-blue-500 transform -translate-y-4 skew-y-1 z-0"></div>

                <div className={contentClass}>
                  {iconWrapper("bg-blue-100", "text-blue-600", HiPaperAirplane)}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800">Login</h2>
                    <p className="text-gray-600">
                      Akses akun Anda untuk memantau status pengaduan, mendapatkan pembaruan, dan terhubung dengan
                      layanan kami.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                  <Link href="/auth/login" className="w-full">
                    <Button color="blue" size="lg" className="w-full flex items-center justify-center gap-2">
                      <HiOutlineLogin className="h-5 w-5" />
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

