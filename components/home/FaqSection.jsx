"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"



export default function FaqSection() {
  const faqRef = useRef(null)
  const [openFaq, setOpenFaq] = useState(null)

  const faqItems = [
    {
      question: "Apa itu Lapor KK Bupati?",
      answer:
        "Lapor KK Bupati adalah platform pengaduan online resmi Pemerintah Kabupaten Kupang yang memungkinkan masyarakat menyampaikan keluhan, aspirasi, dan laporan terkait layanan publik secara langsung kepada Bupati Kupang.",
    },
    {
      question: "Berapa lama laporan saya akan diproses?",
      answer:
        "Setiap laporan akan diverifikasi dalam waktu 1x24 jam. Setelah diverifikasi, laporan akan diteruskan ke OPD terkait dan diproses dalam waktu 3-14 hari kerja tergantung kompleksitas masalah.",
    },
    {
      question: "Apakah identitas pelapor akan dirahasiakan?",
      answer:
        "Ya, identitas pelapor akan dijaga kerahasiaannya. Namun, kami tetap memerlukan data diri yang valid untuk keperluan verifikasi dan tindak lanjut laporan.",
    },
    {
      question: "Jenis laporan apa saja yang dapat disampaikan?",
      answer:
        "Anda dapat melaporkan berbagai masalah terkait infrastruktur, pelayanan publik, kesehatan, pendidikan, lingkungan, dan masalah sosial lainnya di wilayah Kabupaten Kupang.",
    },
  ]

  return (
    <div ref={faqRef} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang layanan pengaduan kami.
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
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  className="flex justify-between items-center w-full p-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.question}</h3>
                  <svg
                    className={`w-5 h-5 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
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
  )
}

