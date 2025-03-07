"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Spinner } from "flowbite-react";

export default function AuthRedirectGuard({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          validateStatus: () => true, // ✅ Anggap semua status sukses
        });

        if (res.status === 200 && res.data?.user) {
          router.replace("/pelapor/dashboard");
        }
      } catch (error) {
        // Optional log, kalau mau tracking internal error
        console.debug("Auth check error:", error);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Spinner size="lg" />
      </div>
    );
  }

  return children;
}
