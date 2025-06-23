'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiMailOpen } from 'react-icons/hi';

export default function FaqSection() {
  const faqRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const faqItems = [
    {
      question: 'Apa itu Lapor Kaka Bupati?',
      answer:
        'Lapor Kaka Bupati adalah platform pengaduan online resmi Pemerintah Kabupaten Kupang yang memungkinkan masyarakat menyampaikan keluhan, aspirasi, dan laporan terkait layanan publik secara langsung kepada Bupati Kupang.',
    },
    {
      question: 'Berapa lama laporan saya akan diproses?',
      answer:
        'Setiap laporan akan diverifikasi dalam waktu 1x24 jam. Setelah diverifikasi, laporan akan diteruskan ke OPD terkait dan diproses dalam waktu 3-14 hari kerja tergantung kompleksitas masalah.',
    },
    {
      question: 'Apakah identitas pelapor akan dirahasiakan?',
      answer:
        'Ya, identitas pelapor akan dijaga kerahasiaannya. Namun, kami tetap memerlukan data diri yang valid untuk keperluan verifikasi dan tindak lanjut laporan.',
    },
    {
      question: 'Jenis laporan apa saja yang dapat disampaikan?',
      answer:
        'Anda dapat melaporkan berbagai masalah terkait infrastruktur, pelayanan publik, kesehatan, pendidikan, lingkungan, dan masalah sosial lainnya di wilayah Kabupaten Kupang.',
    },
  ];

  return (
    <div ref={faqRef} className="py-20 bg-blue-50 dark:bg-gray-700">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-gray-200">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Temukan jawaban untuk pertanyaan umum tentang layanan pengaduan
            kami.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                {/* Envelope-like header */}
                <div
                  className={`h-1 ${openFaq === index ? 'bg-blue-500' : 'bg-gray-200'}`}
                ></div>

                <button
                  className="flex justify-between items-center w-full p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex items-center">
                    {openFaq === index ? (
                      <HiMailOpen className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    ) : (
                      <HiOutlineMail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    )}
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                      {item.question}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-5 border-t border-gray-200 bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-600 dark:text-gray-100">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
