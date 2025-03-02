"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Spinner } from "flowbite-react";

export default function AuthProtectGuard({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const user = res.data?.user;

        if (!user) {
          router.replace("/"); // Redirect ke halaman utama jika tidak login
        }
      } catch (error) {
        router.replace("/"); // Redirect juga jika error (token invalid/dll)
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
        <span className="ml-2">Memeriksa autentikasi...</span>
      </div>
    );
  }

  return children;
}
