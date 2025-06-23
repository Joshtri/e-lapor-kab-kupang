'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'flowbite-react';
import {
  HiOutlineDownload,
  HiOutlineDeviceMobile,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineBell,
  HiOutlineLocationMarker,
  HiOutlineClock,
} from 'react-icons/hi';

export default function AppDownloadSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const appFeatures = [
    'Laporkan masalah kapan saja dan di mana saja',
    'Notifikasi status laporan',
    'Unggah foto bukti langsung dari ponsel',
    'Pantau proses penanganan secara real-time',
    'Pengingat jadwal tindak lanjut',
  ];

  const downloadUrl = '/LAPOR-KK-BUPATI.apk'; // Update with your actual download URL

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border-t border-blue-100 dark:border-gray-700 relative overflow-hidden">
      {/* Decorative elements to match the envelope theme */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fillOpacity='0.4' fillRule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500 opacity-10"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-500 opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Product Introduction Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <HiOutlineMail className="text-blue-600 dark:text-blue-400 h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Lapor Kaka Bupati: Suara Anda, Prioritas Kami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Aplikasi resmi Pemerintah Kabupaten Kupang untuk menerima laporan,
            pengaduan, dan aspirasi masyarakat secara langsung. Dirancang untuk
            memberikan pelayanan publik yang transparan, efisien, dan responsif.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium text-sm">
              <HiOutlineDeviceMobile className="h-4 w-4 mr-2" />
              Tersedia di Android
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
              Layanan Pengaduan{' '}
              <span className="text-blue-600 dark:text-blue-400">
                di Genggaman Anda
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300">
              Unduh aplikasi Lapor Kaka Bupati untuk pengalaman yang lebih baik.
              Sampaikan laporan, pantau status pengaduan, dan dapatkan
              notifikasi penting langsung dari ponsel Android Anda.
            </p>

            <motion.div
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative"
            >
              <Button
                href={downloadUrl}
                download
                size="xl"
                gradientDuoTone="purpleToBlue"
                className="font-medium flex items-center gap-2 group"
              >
                <HiOutlineDownload className="h-5 w-5 group-hover:animate-bounce" />
                Download Aplikasi
              </Button>

              {isHovered && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                >
                  Gratis!
                </motion.div>
              )}
            </motion.div>

            <div className="mt-6 border border-blue-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium"
              >
                <span className="flex items-center">
                  <HiOutlineDocumentText className="h-5 w-5 mr-2" />
                  Fitur Aplikasi
                </span>
                <HiOutlineChevronDown
                  className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-white dark:bg-gray-900"
                >
                  <ul className="space-y-3">
                    {appFeatures.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <HiOutlineCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right side - Phone mockup */}
          <motion.div
            className="relative mx-auto lg:mx-0 lg:ml-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-[280px] h-[560px] mx-auto">
              {/* Phone frame */}
              <div className="absolute inset-0 bg-gray-900 rounded-[40px] shadow-xl overflow-hidden border-4 border-gray-800">
                {/* Status bar */}
                <div className="absolute top-0 inset-x-0 h-6 bg-black z-10">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-700 rounded-full"></div>
                </div>

                {/* App screenshot */}
                <div className="absolute inset-0 pt-6">
                  {/* Replace with your actual app screenshot */}
                  <div className="h-full w-full bg-blue-900 flex flex-col">
                    {/* App header */}
                    <div className="bg-blue-800 p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                        <HiOutlineMail className="text-blue-600 h-5 w-5" />
                      </div>
                      <div className="text-white font-bold">
                        Lapor Kaka Bupati
                      </div>
                    </div>

                    {/* App content - simplified mockup */}
                    <div className="flex-1 bg-white p-3 flex flex-col gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <HiOutlineLocationMarker className="text-blue-600 h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium dark:text-slate-700">
                            Laporan Jalan Rusak
                          </div>
                          <div className="text-xs text-gray-500">
                            Kecamatan Kupang Tengah
                          </div>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Proses
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <HiOutlineBell className="text-blue-600 h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium dark:text-slate-700">
                            Laporan Lampu Jalan
                          </div>
                          <div className="text-xs text-gray-500">
                            Kecamatan Kupang Barat
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Selesai
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <HiOutlineClock className="text-blue-600 h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium dark:text-slate-700">
                            Laporan Sampah
                          </div>
                          <div className="text-xs text-gray-500">
                            Kecamatan Kupang Timur
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Baru
                        </div>
                      </div>

                      {/* Floating action button */}
                      <div className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                        <HiOutlineMail className="text-white h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-blue-500/20 z-[-1]"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                }}
              />
              <motion.div
                className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-blue-500/10 z-[-1]"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                  delay: 0.5,
                }}
              />

              {/* QR Code */}
              <motion.div
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg hidden lg:block"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xs font-medium text-center mb-2 dark:text-white">
                  Scan QR
                </div>
                <div className="w-24 h-24 relative flex items-center justify-center bg-white">
                  <img
                    src="/path-to-your-qr-code.png"
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>

              {/* Floating envelope icon */}
              <motion.div
                className="absolute -top-10 -right-6 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hidden md:block"
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                }}
              >
                <HiOutlineMail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* System requirements */}
        <motion.div
          className="mt-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-blue-100 dark:border-gray-700 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <HiOutlineDeviceMobile className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            Persyaratan Sistem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Sistem Operasi
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Android 6.0 atau lebih tinggi
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Ruang Penyimpanan
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Minimal 50MB tersedia
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Koneksi
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Internet diperlukan
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
