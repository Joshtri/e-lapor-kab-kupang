'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import BupImg from '@/public/bup.jpg';
import WabupImg from '@/public/wabup.jpg';
export default function LeadershipSectionAlternative() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-900 to-blue-800 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.4' fillRule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-10 bg-blue-300 opacity-50 transform -skew-y-1" />
      <div className="absolute bottom-0 right-0 w-full h-10 bg-blue-500 opacity-50 transform skew-y-1" />

      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-400 opacity-30" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-500 opacity-30" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Pimpinan Kabupaten Kupang</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Berkomitmen untuk mendengarkan aspirasi masyarakat dan memberikan
            pelayanan terbaik untuk kemajuan Kabupaten Kupang.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center flex-wrap gap-8 max-w-2xl mx-auto">
          {/* Bupati */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-[360px] bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl mx-auto"
          >
            <div className="relative w-full h-[450px] overflow-hidden">
              <Image
                src={BupImg}
                alt="Bupati Kabupaten Kupang"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-1">Yosef Lede, S.H</h3>
              <p className="text-blue-200 font-medium mb-4">
                Bupati Kabupaten Kupang
              </p>
              <p className="text-blue-100 italic">
                "Kami berkomitmen untuk mewujudkan pemerintahan yang transparan
                dan responsif terhadap aspirasi masyarakat Kabupaten Kupang."
              </p>
            </div>
          </motion.div>

          {/* Wakil Bupati */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-[360px] bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl mx-auto"
          >
            <div className="relative w-full h-[450px] overflow-hidden">
              <Image
                src={WabupImg}
                alt="Wakil Bupati Kabupaten Kupang"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-1">
                Aurum Obe Titu Eki, S.Ars., M.Ars.
              </h3>
              <p className="text-blue-200 font-medium mb-4">
                Wakil Bupati Kabupaten Kupang
              </p>
              <p className="text-blue-100 italic">
                "Melalui platform LAPOR KK BUPATI, kami hadir untuk mendengar
                dan menindaklanjuti setiap aspirasi masyarakat demi Kabupaten
                Kupang yang lebih baik."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
