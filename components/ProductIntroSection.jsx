'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineUserGroup,
} from 'react-icons/hi';

export default function ProductIntroSection() {
  const features = [
    {
      icon: (
        <HiOutlineClipboardCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      ),
      title: 'Pelaporan Mudah',
      description:
        'Laporkan masalah dengan cepat dan mudah melalui aplikasi. Sertakan foto, lokasi, dan deskripsi untuk membantu penanganan yang tepat.',
    },
    {
      icon: (
        <HiOutlineClock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      ),
      title: 'Respons Cepat',
      description:
        'Setiap laporan akan diverifikasi dalam 1x24 jam dan diteruskan ke OPD terkait untuk ditindaklanjuti dengan cepat.',
    },
    {
      icon: (
        <HiOutlineMail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      ),
      title: 'Notifikasi Status',
      description:
        'Dapatkan update status laporan Anda secara real-time. Kami akan memberitahu Anda setiap ada perkembangan.',
    },
    {
      icon: (
        <HiOutlineUserGroup className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      ),
      title: 'Transparansi Publik',
      description:
        'Semua laporan dan tindak lanjut dapat dipantau oleh publik, menciptakan akuntabilitas dan transparansi pemerintahan.',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-10 bg-blue-100 dark:bg-blue-900/30 opacity-50 transform -skew-y-1" />
      <div className="absolute bottom-0 right-0 w-full h-10 bg-blue-100 dark:bg-blue-900/30 opacity-50 transform skew-y-1" />

      <div className="container mx-auto px-4">
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
            Tentang LAPOR KK BUPATI
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Platform pengaduan online resmi yang menghubungkan masyarakat
            langsung dengan Bupati Kabupaten Kupang untuk mewujudkan pelayanan
            publik yang lebih baik.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-50 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto italic">
            "Kami berkomitmen untuk mendengarkan dan menindaklanjuti setiap
            aspirasi masyarakat demi Kabupaten Kupang yang lebih baik."
          </p>
          <p className="mt-2 font-medium text-blue-600 dark:text-blue-400">
            - Bupati Kabupaten Kupang
          </p>
        </motion.div>
      </div>
    </section>
  );
}
