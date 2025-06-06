'use client';

import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineDocumentReport,
} from 'react-icons/hi';

export default function FloatingHelper() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpenModal(true)}
          className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <HiOutlineQuestionMarkCircle className="h-6 w-6" />
        </motion.button>
      </motion.div>

      {/* Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
        <Modal.Header className="border-b-4 border-blue-500">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <HiOutlineMail className="text-blue-600 h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Alur Pengaduan E-LAPOR!</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              {/* Timeline for complaint flow with mail icons */}
              <ol className="relative border-l-2 border-dashed border-blue-300 dark:border-blue-700">
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full -left-5 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <HiOutlineMail className="text-blue-600 dark:text-blue-300 h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    Registrasi Akun
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Daftar akun baru dengan mengisi data diri lengkap
                  </p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full -left-5 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <HiOutlineDocumentReport className="text-blue-600 dark:text-blue-300 h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Login
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Masuk ke akun yang telah didaftarkan
                  </p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full -left-5 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <HiMailOpen className="text-blue-600 dark:text-blue-300 h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Buat Pengaduan
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Isi formulir pengaduan dengan lengkap dan jelas
                  </p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full -left-5 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <HiPaperAirplane className="text-blue-600 dark:text-blue-300 h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Verifikasi
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Admin akan memverifikasi pengaduan Anda
                  </p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full -left-5 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <HiOutlineCheckCircle className="text-blue-600 dark:text-blue-300 h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Tindak Lanjut
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Pengaduan akan ditindaklanjuti dan Anda dapat memantau
                    prosesnya
                  </p>
                </li>
              </ol>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-blue-900/30 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <HiOutlineMail className="text-blue-600 h-5 w-5" />
                Catatan Penting:
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  Pastikan data yang diisi valid dan dapat dipertanggungjawabkan
                </li>
                <li>Lengkapi dokumen pendukung jika diperlukan</li>
                <li>Pengaduan akan diproses dalam waktu 3-5 hari kerja</li>
                <li>Anda akan mendapat notifikasi melalui email terdaftar</li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientduotone="blueToGreen"
            onClick={() => setOpenModal(false)}
            className="flex items-center gap-2"
          >
            <HiOutlineCheckCircle className="h-5 w-5" />
            Saya Mengerti
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
