'use client';

import { Modal, Button } from 'flowbite-react';
import {
  HiOutlineLogout,
  HiOutlineMail,
  HiPaperAirplane,
} from 'react-icons/hi';

const LogoutConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal show={open} onClose={onClose} size="md">
      <Modal.Header className="border-b-2 border-purple-100 dark:border-purple-900">
        <div className="flex items-center">
          <HiOutlineMail className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span>Konfirmasi Logout</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
            <HiPaperAirplane className="h-6 w-6 text-purple-600 dark:text-purple-400 transform rotate-90" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Apakah Anda yakin ingin logout dari akun ini?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="failure" onClick={onConfirm} className="flex items-center gap-2">
          <HiOutlineLogout className="h-4 w-4" />
          Ya, Logout
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutConfirmationModal;
