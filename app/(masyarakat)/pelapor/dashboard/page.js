"use client";

import DashboardPelapor from "@/components/pelapor/pelapor-dashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPelaporPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data.user);
      } catch (error) {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Pastikan dashboard hanya dirender setelah user tersedia
  useEffect(() => {
    if (user !== null) {
      setRendered(true);
    }
  }, [user]);

  if (loading || !rendered) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Memuat dashboard...
      </div>
    );
  }

  return <DashboardPelapor user={user} />;
}
