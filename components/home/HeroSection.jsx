'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'flowbite-react';
import { motion, useTransform } from 'framer-motion';
import {
  HiOutlineMail,
  HiOutlineMailOpen,
  HiPaperAirplane,
} from 'react-icons/hi';
import logoKabKupang from '@/public/logo-kab-kupang.png';

export default function HeroSection({ scrollYProgress, startTour }) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  // Hide scroll indicator after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="relative bg-gradient-to-br mt-0 from-blue-900 to-blue-700 text-white overflow-hidden shadow-2xl"
      style={{ y: heroY }}
    >
      {/* Envelope pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.4' fillRule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Envelope decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-blue-800 opacity-20 transform -skew-y-2"></div>
      <div className="absolute bottom-0 right-0 w-full h-20 bg-blue-800 opacity-20 transform skew-y-2"></div>

      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>

      {/* Logo in top-left corner */}
      {/* Logo di kanan atas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-16 right-10 md:top-20 md:right-16 z-20"
      >
        <div className="bg-blue-400 rounded-full p-1 shadow-lg">
          <Image
            src={logoKabKupang}
            alt="Logo Kabupaten Kupang"
            width={80}
            height={80}
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-24 mt-5 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Envelope icon */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-6 bg-white/10 w-24 h-24 rounded-full flex items-center justify-center"
          >
            <HiOutlineMail className="text-white h-12 w-12" />
          </motion.div>

          <h1 className="mb-6 text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            Selamat Datang di{' '}
            <span className="relative">
              LAPOR KK BUPATI
              <motion.div
                className="absolute -bottom-2 left-0 h-2 bg-yellow-400 w-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </span>
          </h1>

          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Layanan Aspirasi dan Pengaduan Online untuk mendukung transparansi
            dan pelayanan publik di Pemerintah Daerah Kabupaten Kupang.
          </p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="/auth/register">
              <Button
                size="xl"
                gradientduotone="purpleToBlue"
                className="font-medium flex items-center gap-2"
              >
                <HiPaperAirplane className="h-5 w-5" />
                Laporkan Sekarang
              </Button>
            </Link>

            <Button
              size="xl"
              color="light"
              className="flex items-center gap-2"
              onClick={() => {
                const processSection =
                  document.getElementById('process-section');
                processSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <HiOutlineMailOpen className="h-5 w-5" />
              Pelajari Proses
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
