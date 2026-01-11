'use client';

import { Modal, Button } from 'flowbite-react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

export default function WhatsAppModal({ openModal, setOpenModal }) {
  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Hubungi via WhatsApp</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
            <div className="flex items-center mb-3">
              <HiOutlineInformationCircle className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Informasi Penting</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Saat menghubungi kami via WhatsApp, mohon sertakan informasi
              berikut:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-2">
              <li>NIK</li>
              <li>Nama Lengkap</li>
              <li>Alamat</li>
              <li>Deskripsi Laporan yang jelas</li>
            </ul>
          </div>

          <Button
            gradientduotone="greenToBlue"
            size="lg"
            onClick={() => {
              const message = encodeURIComponent(
                'Halo KK Yos & Sis Arumi,\n\nNIK: \nNAMA: \nAlamat: \n\nSaya ingin melaporkan\n\nDeskripsi Laporan: \n\nTerima kasih. UIS NENO NOKAN KIT.',
              );
              window.open(
                `https://wa.me/6281277195777?text=${message}`,
                '_blank',
              );
            }}
          >
            Hubungi Opsi 1
          </Button>

          <Button
            gradientduotone="purpleToPink"
            size="lg"
            onClick={() => {
              const message = encodeURIComponent(
                'Halo KK Yos & Sis Arumi,\n\nNIK: \nNAMA: \nAlamat: \n\nSaya ingin melaporkan\n\nTerima kasih. UIS NENO NOKAN KIT.',
              );
              window.open(
                `https://wa.me/6281339300533?text=${message}`,
                '_blank',
              );
            }}
          >
            Hubungi Opsi 2
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
