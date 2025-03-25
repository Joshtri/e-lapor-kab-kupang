"use client";

import { useEffect, useState } from "react";
import { Modal, Spinner } from "flowbite-react";
import axios from "axios";
import OnboardingOPDForm from "@/components/opd/Onboard/FormOpd";

export default function OPDOnboardingDialog() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let interval;

    const simulateProgress = () => {
      let value = 0;
      interval = setInterval(() => {
        value += Math.random() * 10;
        if (value >= 95) return;
        setProgress(Math.floor(value));
      }, 200);
    };

    const checkProfile = async () => {
      simulateProgress();
      try {
        const res = await axios.get("/api/auth/me");
        const { id, role } = res.data.user || {};

        if (role !== "OPD") return;

        setUserId(id);

        const check = await axios.get("/api/opd/check-profile");
        if (!check.data?.hasProfile) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("Gagal mengecek profil OPD:", err);
      } finally {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setLoading(false), 300);
      }
    };

    checkProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-600 dark:text-gray-300">
        <Spinner size="xl" />
        <p>Memuat data OPD... {progress}%</p>
      </div>
    );
  }

  return (
    <Modal show={showOnboarding} size="lg" onClose={() => {}}>
      <Modal.Header>Lengkapi Profil OPD Anda</Modal.Header>
      <Modal.Body>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">
          Profil OPD wajib diisi sebelum melanjutkan ke dashboard.
        </p>
        {userId && (
          <OnboardingOPDForm userId={userId} onSuccess={() => setShowOnboarding(false)} />
        )}
      </Modal.Body>
    </Modal>
  );
}
