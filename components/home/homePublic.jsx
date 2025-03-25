"use client"

import AuthRedirectGuard from "@/components/AuthRedirectGuard"
import { driver } from "driver.js"
import { useScroll } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// Import komponen-komponen
import CardsSection from "@/components/home/CardsSection"
import ComparisonSection from "@/components/home/ComparisonSection"
import FaqSection from "@/components/home/FaqSection"
import Footer from "@/components/home/Footer"
import HeroSection from "@/components/home/HeroSection"
import ParticlesBackground from "@/components/home/ParticlesBackground"
import ProcessSection from "@/components/home/ProcessSection"
import ReportsSection from "@/components/home/ReportsSection"
import StatsSection from "@/components/home/StatsSection"
import VisualizationSection from "@/components/home/VisualizationSection"
import WhatsAppModal from "@/components/home/WhatsAppModal"

export default function Home() {
  // Animation references
  const containerRef = useRef(null)
  const statsRef = useRef(null)
  const chartRef = useRef(null)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Modal state
  const [openModal, setOpenModal] = useState(false)

  // Driver.js tour
  const driverObj = useRef(null)

  useEffect(() => {
    driverObj.current = driver({
      showProgress: true,
      nextBtnText: "Selanjutnya",
      prevBtnText: "Sebelumnya",
      doneBtnText: "Selesai",
      steps: [
        {
          element: "#register-card",
          popover: {
            title: "Daftar Akun",
            description: "Langkah pertama: Daftar akun untuk mulai menggunakan layanan pengaduan online.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#process-section",
          popover: {
            title: "Alur Proses",
            description: "Pelajari bagaimana laporan Anda akan diproses oleh pemerintah daerah.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#stats-section",
          popover: {
            title: "Transparansi Data",
            description: "Lihat statistik real-time tentang pengaduan yang telah diproses.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#visualization-section",
          popover: {
            title: "Visualisasi Data",
            description: "Analisis data pengaduan berdasarkan kategori dan status penyelesaian.",
            side: "left",
            align: "center",
          },
        },
      ],
    })
  }, [])

  const startTour = () => {
    if (driverObj.current) {
      driverObj.current.drive()
    }
  }

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
    <AuthRedirectGuard>
      {/* Mail-themed background with subtle envelope patterns */}
      <div className="fixed inset-0 bg-blue-50 opacity-50 z-0">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fillOpacity='0.05' fillRule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <ParticlesBackground />
      <main ref={containerRef} className="min-h-screen overflow-x-hidden relative z-10">
        {/* Hero Section with Parallax */}
        <HeroSection scrollYProgress={scrollYProgress} startTour={startTour} />

        {/* Stats Section */}
        <StatsSection />

        {/* Process Section */}
        <ProcessSection />

        {/* Cards Section */}
        <CardsSection openWhatsAppModal={() => setOpenModal(true)} />

        {/* Recent Reports Section */}
        <ReportsSection />

        {/* Data Visualization Section */}
        <VisualizationSection chartRef={chartRef} />

        {/* FAQ Section */}
        <FaqSection />

        {/* Online vs Offline Process Section */}
        <ComparisonSection />

        {/* WhatsApp Modal */}
        <WhatsAppModal openModal={openModal} setOpenModal={setOpenModal} />

        {/* Footer */}
        <Footer />
      </main>
    </AuthRedirectGuard>
  )
}

