"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function LeadershipSection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative elements to match the envelope theme */}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pimpinan Kabupaten Kupang</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berkomitmen untuk mendengarkan aspirasi masyarakat dan memberikan pelayanan terbaik untuk kemajuan Kabupaten
            Kupang.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Bupati Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="relative h-[400px] overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Bupati Kabupaten Kupang"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Nama Bupati</h3>
              <p className="text-blue-600 font-medium mb-4">Bupati Kabupaten Kupang</p>
              <p className="text-gray-600 italic">
                "Kami berkomitmen untuk mewujudkan pemerintahan yang transparan dan responsif terhadap aspirasi
                masyarakat Kabupaten Kupang."
              </p>
            </div>
          </motion.div>

          {/* Wakil Bupati Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="relative h-[400px] overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Wakil Bupati Kabupaten Kupang"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Nama Wakil Bupati</h3>
              <p className="text-blue-600 font-medium mb-4">Wakil Bupati Kabupaten Kupang</p>
              <p className="text-gray-600 italic">
                "Melalui platform LAPOR KK BUPATI, kami hadir untuk mendengar dan menindaklanjuti setiap aspirasi
                masyarakat demi Kabupaten Kupang yang lebih baik."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    
  )
}
