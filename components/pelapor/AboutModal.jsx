"use client"

import { Modal, Button, Badge } from "flowbite-react"
import { HiOutlineMail, HiOutlineInformationCircle, HiOutlineCode, HiOutlineHeart } from "react-icons/hi"
import { motion } from "framer-motion"

export default function AboutModal({ isOpen, onClose }) {
  const appInfo = {
    name: "Lapor Mail",
    version: "2.0.1",
    description: "Layanan Pengaduan Online Terpadu",
    developer: "Tim Pengembang Lapor KK",
    year: "2024",
    features: [
      "Pelaporan Online Real-time",
      "Notifikasi Push",
      "Chat dengan Bupati & OPD",
      "Tracking Status Laporan",
      "Mode Dark/Light",
      "Responsive Design",
    ],
    contact: {
      whatsapp: "+62 812-3715-9777",
      email: "support@lapormail.id",
    },
  }

  return (
    <Modal show={isOpen} onClose={onClose} size="md" className="z-50">
      <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full"
          >
            <HiOutlineMail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tentang Aplikasi</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Informasi aplikasi dan pengembang</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="p-6">
        <div className="space-y-6">
          {/* App Info */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
            >
              <HiOutlineMail className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{appInfo.name}</h2>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Badge color="blue" size="sm">
                v{appInfo.version}
              </Badge>
              <Badge color="green" size="sm">
                Aktif
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{appInfo.description}</p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <HiOutlineInformationCircle className="mr-2 h-5 w-5 text-blue-500" />
              Fitur Utama
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {appInfo.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Developer Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <HiOutlineCode className="mr-2 h-5 w-5 text-green-500" />
              Informasi Pengembang
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Dikembangkan oleh:</span>
                <span className="font-medium text-gray-900 dark:text-white">{appInfo.developer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tahun:</span>
                <span className="font-medium text-gray-900 dark:text-white">{appInfo.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">WhatsApp:</span>
                <a
                  href={`https://wa.me/${appInfo.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {appInfo.contact.whatsapp}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <a
                  href={`mailto:${appInfo.contact.email}`}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {appInfo.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <HiOutlineHeart className="h-6 w-6 text-red-500 mx-auto mb-2" />
            </motion.div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Terima kasih telah menggunakan aplikasi kami untuk melayani masyarakat dengan lebih baik.
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-t border-gray-200 dark:border-gray-700">
        <Button onClick={onClose} color="blue" className="w-full">
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
