"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineDocumentReport,
  HiOutlineExclamation,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi";

export default function ProcessSection() {
  const processRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isScrollingLocked, setIsScrollingLocked] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const processSteps = [
    { title: "Buat Laporan", description: "Daftarkan diri dan buat laporan dengan detail yang jelas.", icon: HiOutlineDocumentReport, color: "blue" },
    { title: "Verifikasi", description: "Tim kami akan memverifikasi laporan Anda.", icon: HiOutlineExclamation, color: "yellow" },
    { title: "Proses", description: "Laporan diteruskan ke OPD terkait untuk ditindaklanjuti.", icon: HiOutlineClock, color: "purple" },
    { title: "Penyelesaian", description: "Laporan diselesaikan dan Anda mendapat notifikasi.", icon: HiOutlineCheckCircle, color: "green" },
  ];

  // ✅ Deteksi apakah user sedang di mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile jika < 768px
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) return; // ❌ Jangan jalankan animasi jika di mobile

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsScrollingLocked(true);
          setActiveStep(1);
          setHasAnimated(true);
        }
      },
      { threshold: 0.9 }
    );

    if (processRef.current) {
      observer.observe(processRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, isMobile]);

  useEffect(() => {
    if (isScrollingLocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isScrollingLocked]);

  useEffect(() => {
    if (isMobile) return; // ❌ Jangan jalankan animasi jika di mobile

    if (activeStep > 0 && activeStep < processSteps.length) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1);
      }, 900);

      return () => clearTimeout(timer);
    }

    if (activeStep >= processSteps.length) {
      setTimeout(() => {
        setIsScrollingLocked(false);
      }, 800);
    }
  }, [activeStep, isMobile]);

  return (
    <div id="process-section" ref={processRef} className="py-20 bg-gray-50 dark:bg-gray-800 relative">
      <div className="container mx-auto px-4">
        {/* Judul */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bagaimana Proses Pengaduan Bekerja?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kami memastikan setiap pengaduan ditangani dengan cepat dan efektif. Berikut adalah alur proses pengaduan di platform kami:
          </p>
        </motion.div>

        {/* Garis Tengah Horizontal Animasi */}
        {!isMobile && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: activeStep === processSteps.length ? "100%" : `${(activeStep / processSteps.length) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-[67%] left-0 right-0 mx-auto h-[4px] bg-blue-500 dark:bg-blue-600 z-0"
            style={{ maxWidth: "60%", transform: "translateY(-50%)" }}
          ></motion.div>
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
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full"
                whileHover={{ scale: 1.05 }}
              >
                {/* Icon dengan efek putaran saat muncul */}
                <motion.div
                  initial={isMobile ? {} : { rotate: 0 }}
                  animate={isMobile || activeStep > index ? { rotate: 360 } : {}}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`flex items-center justify-center w-16 h-16 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900 text-${step.color}-600 dark:text-${step.color}-300 mx-auto mb-4`}
                >
                  <step.icon className="h-8 w-8" />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
