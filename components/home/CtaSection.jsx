"use client";

import Link from "next/link";
import { Button } from "flowbite-react";
import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <motion.div
      className="py-10 px-6 md:py-7 md:px-8 bg-gradient-to-r mt-10 from-blue-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800 text-white rounded-lg mx-4 md:mx-auto max-w-5xl"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        <motion.h2
          className="text-2xl md:text-2xl font-bold mb-3"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Suara Anda Berharga!
        </motion.h2>
        <motion.p
          className="text-base md:text-lg text-blue-100 dark:text-gray-300 max-w-lg mx-auto mb-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Laporkan masalah dan sampaikan aspirasi Anda. Bersama, kita membangun Kabupaten Kupang yang lebih baik!
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/auth/register">
            <Button size="lg" color="light" className="font-medium text-blue-700 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
              Mulai Laporkan Sekarang
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
