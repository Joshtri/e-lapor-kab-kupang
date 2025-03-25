"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HiOutlineMail, HiMailOpen, HiPaperAirplane, HiOutlineClipboardCheck } from "react-icons/hi"

export default function ProcessSection() {
  const processRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const [isScrollingLocked, setIsScrollingLocked] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const processSteps = [
    {
      title: "Tulis Laporan",
      description: "Daftarkan diri dan buat laporan dengan detail yang jelas.",
      icon: HiOutlineMail,
      color: "blue",
      envelopeState: "closed",
    },
    {
      title: "Verifikasi",
      description: "Tim kami akan memverifikasi laporan Anda.",
      icon: HiMailOpen,
      color: "yellow",
      envelopeState: "opening",
    },
    {
      title: "Proses",
      description: "Laporan diteruskan ke OPD terkait untuk ditindaklanjuti.",
      icon: HiPaperAirplane,
      color: "purple",
      envelopeState: "sending",
    },
    {
      title: "Penyelesaian",
      description: "Laporan diselesaikan dan Anda mendapat notifikasi.",
      icon: HiOutlineClipboardCheck,
      color: "green",
      envelopeState: "delivered",
    },
  ]

  // Deteksi apakah user sedang di mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // Mobile jika < 768px
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    if (isMobile) return // Jangan jalankan animasi jika di mobile

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsScrollingLocked(true)
          setActiveStep(1)
          setHasAnimated(true)
        }
      },
      { threshold: 0.9 },
    )

    if (processRef.current) {
      observer.observe(processRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, isMobile])

  useEffect(() => {
    if (isScrollingLocked) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isScrollingLocked])

  useEffect(() => {
    if (isMobile) return // Jangan jalankan animasi jika di mobile

    if (activeStep > 0 && activeStep < processSteps.length) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1)
      }, 900)

      return () => clearTimeout(timer)
    }

    if (activeStep >= processSteps.length) {
      setTimeout(() => {
        setIsScrollingLocked(false)
      }, 800)
    }
  }, [activeStep, isMobile, processSteps.length])

  return (
    <div id="process-section" ref={processRef} className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        {/* Judul */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <HiOutlineMail className="text-blue-600 h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bagaimana Proses Pengaduan Bekerja?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami memastikan setiap pengaduan ditangani dengan cepat dan efektif. Berikut adalah alur proses pengaduan di
            platform kami:
          </p>
        </motion.div>

        {/* Envelope path animation */}
        {!isMobile && (
          <div className="relative mb-16">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 transform -translate-y-1/2"></div>
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: activeStep === processSteps.length ? "100%" : `${(activeStep / processSteps.length) * 100}%`,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-1/2 left-0 h-2 bg-blue-500 transform -translate-y-1/2 z-10"
            ></motion.div>

            {/* Envelope animation along the path */}
            {activeStep > 0 && activeStep <= processSteps.length && (
              <motion.div
                initial={{ left: "0%" }}
                animate={{ left: `${((activeStep - 1) / (processSteps.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20"
              >
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <HiPaperAirplane className="h-8 w-8 text-blue-600 transform rotate-90" />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={isMobile ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
              animate={isMobile || activeStep > index ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2, type: "spring", stiffness: 100 }}
              className="relative"
            >
              <motion.div
                className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 h-full"
                whileHover={{ scale: 1.05 }}
              >
                {/* Envelope icon with animation */}
                <motion.div
                  initial={isMobile ? {} : { rotate: 0 }}
                  animate={isMobile || activeStep > index ? { rotate: 360 } : {}}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`flex items-center justify-center w-16 h-16 rounded-full bg-${step.color}-100 mx-auto mb-4`}
                >
                  <step.icon className={`h-8 w-8 text-${step.color}-600`} />
                </motion.div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Envelope status indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${step.color}-100 text-${step.color}-800`}
                    >
                      {step.envelopeState === "closed" && "Surat Ditulis"}
                      {step.envelopeState === "opening" && "Surat Dibuka"}
                      {step.envelopeState === "sending" && "Surat Dikirim"}
                      {step.envelopeState === "delivered" && "Surat Diterima"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

