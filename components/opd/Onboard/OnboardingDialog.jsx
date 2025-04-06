'use client';

import { useEffect, useState } from 'react';
import { Modal } from 'flowbite-react';
import OnboardingOPDForm from '@/components/opd/Onboard/FormOpd';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiMailOpen, HiPaperAirplane } from 'react-icons/hi';

export default function OPDOnboardingDialog({
  show,
  setShow,
  loading,
  userId,
}) {
  const [progress, setProgress] = useState(0);
  const [envelopeState, setEnvelopeState] = useState('closed');

  useEffect(() => {
    if (!loading) return;

    let interval;
    let value = 0;

    interval = setInterval(() => {
      value += Math.random() * 10;
      if (value >= 95) {
        clearInterval(interval);
        setProgress(100);
        setEnvelopeState('open');
        return;
      }

      setProgress(Math.floor(value));
      if (value > 30 && value < 60) setEnvelopeState('opening');
      else if (value >= 60) setEnvelopeState('open');
    }, 200);

    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-gray-900">
        <div className="relative">
          <motion.div
            className="w-24 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden"
            animate={{
              rotateY: envelopeState === 'opening' ? [0, 15, 0, -15, 0] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: envelopeState === 'opening' ? Infinity : 0,
            }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-8 bg-purple-500 dark:bg-purple-700 origin-bottom z-10"
              animate={{
                rotateX: envelopeState === 'open' ? -180 : 0,
                backgroundColor:
                  envelopeState === 'open' ? '#9333ea' : '#a855f7',
              }}
              transition={{ duration: 0.5 }}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            />

            <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              {envelopeState === 'closed' && (
                <HiOutlineMail className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              )}
              {envelopeState === 'opening' && (
                <HiMailOpen className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              )}
              {envelopeState === 'open' && (
                <HiPaperAirplane className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-4 bg-purple-300 dark:bg-purple-800" />
          </motion.div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-400">
            Memuat Data OPD
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Menyiapkan formulir pendaftaran...
          </p>

          <div className="w-64 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-purple-600 dark:bg-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-purple-700 dark:text-purple-400">
            {progress}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <Modal
      show={show}
      size="lg"
      onClose={() => {}}
      className="!rounded-lg overflow-hidden"
    >
      <Modal.Header className="border-b-4 border-purple-500 flex items-center gap-2 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
        <HiOutlineMail className="h-5 w-5 text-purple-600" />
        <span>Lengkapi Profil OPD Anda</span>
      </Modal.Header>
      <Modal.Body className="bg-purple-50 dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-4 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-purple-100 dark:border-purple-900/30">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
            <HiMailOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              Registrasi OPD
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Profil OPD wajib diisi sebelum melanjutkan ke dashboard.
            </p>
          </div>
        </div>

        {userId ? (
          <OnboardingOPDForm userId={userId} onSuccess={() => setShow(false)} />
        ) : (
          <p className="text-center text-sm text-gray-500">Memuat user...</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
