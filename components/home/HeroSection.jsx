"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "flowbite-react"
import { HiOutlineArrowDown } from "react-icons/hi"
import { motion, useTransform, AnimatePresence } from "framer-motion"



export default function HeroSection({ scrollYProgress, startTour }) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50])

  // Hide scroll indicator after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className="relative bg-gradient-to-br mt-10 from-blue-900 to-indigo-800 text-white overflow-hidden shadow-2xl"
      style={{ y: heroY }}
    >
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Kabupaten Kupang"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-24 mt-5 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="mb-6 text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            Selamat Datang di LAPOR KK BUPATI Kupang
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Layanan Aspirasi dan Pengaduan Online untuk mendukung transparansi dan pelayanan publik di Pemerintah Daerah
            Kabupaten Kupang.
          </p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="/auth/register">
              <Button size="xl" gradientduotone="purpleToBlue" className="font-medium">
                Laporkan Sekarang
              </Button>
            </Link>
            <Button
              size="xl"
              color="light"
              onClick={() => {
                const processSection = document.getElementById("process-section")
                processSection?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Pelajari Proses
            </Button>
            {/* <Button size="xl" color="light" onClick={startTour}>
              Tur Fitur
            </Button> */}
          </motion.div>

          {/* Scroll indicator */}
          <AnimatePresence>
            {showScrollIndicator && (
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.5 } }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-sm mb-2">Scroll untuk informasi lebih lanjut</span>
                  <HiOutlineArrowDown className="h-6 w-6" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

