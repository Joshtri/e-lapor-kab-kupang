"use client";

import AuthRedirectGuard from "@/components/AuthRedirectGuard";
import { driver } from "driver.js";
import { useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Import komponen-komponen
import CardsSection from "@/components/home/CardsSection";
import ComparisonSection from "@/components/home/ComparisonSection";
import FaqSection from "@/components/home/FaqSection";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import ParticlesBackground from "@/components/home/ParticlesBackground";
import ProcessSection from "@/components/home/ProcessSection";
import ReportsSection from "@/components/home/ReportsSection";
import StatsSection from "@/components/home/StatsSection";
import VisualizationSection from "@/components/home/VisualizationSection";
import WhatsAppModal from "@/components/home/WhatsAppModal";

export default function Home() {
  // Animation references
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const chartRef = useRef(null);
  const setShowScrollIndicator = useState(true);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effect for hero section

  const targetStats = {
    reports: 1250,
    resolved: 1087,
    inProgress: 163,
    satisfaction: 92,
  };

  // Modal state
  const [openModal, setOpenModal] = useState(false);

  // Driver.js tour
  const driverObj = useRef(null);

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
            description:
              "Langkah pertama: Daftar akun untuk mulai menggunakan layanan pengaduan online.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#process-section",
          popover: {
            title: "Alur Proses",
            description:
              "Pelajari bagaimana laporan Anda akan diproses oleh pemerintah daerah.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#stats-section",
          popover: {
            title: "Transparansi Data",
            description:
              "Lihat statistik real-time tentang pengaduan yang telah diproses.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#visualization-section",
          popover: {
            title: "Visualisasi Data",
            description:
              "Analisis data pengaduan berdasarkan kategori dan status penyelesaian.",
            side: "left",
            align: "center",
          },
        },
      ],
    });
  }, []);

  const startTour = () => {
    if (driverObj.current) {
      driverObj.current.drive();
    }
  };

  // Stats animation effect
  useEffect(() => {
    const isInViewport = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    const handleScroll = () => {
      if (isInViewport(statsRef.current)) {
        const interval = setInterval(() => {
          setStats((prevStats) => {
            const newStats = { ...prevStats };
            let completed = true;

            Object.keys(targetStats).forEach((key) => {
              if (newStats[key] < targetStats[key]) {
                const increment = Math.ceil(targetStats[key] / 50);
                newStats[key] = Math.min(
                  newStats[key] + increment,
                  targetStats[key],
                );
                completed = false;
              }
            });

            if (completed) clearInterval(interval);
            return newStats;
          });
        }, 30);

        return () => clearInterval(interval);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide scroll indicator after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 

  return (
    <AuthRedirectGuard>
      {/* Particles Background */}

      <ParticlesBackground />
      <main ref={containerRef} className="min-h-screen overflow-x-hidden">
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

        {/* CTA Section */}
        {/* <CtaSection /> */}

        {/* WhatsApp Modal */}
        <WhatsAppModal openModal={openModal} setOpenModal={setOpenModal} />

        {/* Footer */}
        <Footer />
      </main>
    </AuthRedirectGuard>
  );
}
