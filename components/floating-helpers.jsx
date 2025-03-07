"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

export default function FloatingHelper() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          gradientDuoTone="greenToBlue"
          pill
          size="lg"
          onClick={() => setOpenModal(true)}
          className="shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <HiOutlineQuestionMarkCircle className="mr-2 h-5 w-5" />
          Alur Pengaduan
        </Button>
      </div>

      {/* Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
        <Modal.Header>
          <span className="text-xl font-bold">Alur Pengaduan E-LAPOR!</span>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              {/* Timeline for complaint flow */}
              <ol className="relative border-l border-gray-200 dark:border-gray-700">
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300">1</span>
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Registrasi Akun
                  </h3>
                  <p className="text-base font-normal text-gray-500">
                    Daftar akun baru dengan mengisi data diri lengkap
                  </p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300">2</span>
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Login
                  </h3>
                  <p className="text-base font-normal text-gray-500">
                    Masuk ke akun yang telah didaftarkan
                  </p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300">3</span>
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Buat Pengaduan
                  </h3>
                  <p className="text-base font-normal text-gray-500">
                    Isi formulir pengaduan dengan lengkap dan jelas
                  </p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300">4</span>
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Verifikasi
                  </h3>
                  <p className="text-base font-normal text-gray-500">
                    Admin akan memverifikasi pengaduan Anda
                  </p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300">5</span>
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Tindak Lanjut
                  </h3>
                  <p className="text-base font-normal text-gray-500">
                    Pengaduan akan ditindaklanjuti dan Anda dapat memantau
                    prosesnya
                  </p>
                </li>
              </ol>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Catatan Penting:
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
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
            gradientDuoTone="blueToGreen"
            onClick={() => setOpenModal(false)}
          >
            Saya Mengerti
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
