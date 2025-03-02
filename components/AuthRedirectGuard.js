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
        const res = await axios.get("/api/auth/me");
        const user = res.data?.user;

        if (user) {
          switch (user.role) {
            case "PELAPOR":
              router.replace("/pelapor/dashboard");
              break;
            case "ADMIN":
              router.replace("/adm/dashboard");
              break;
            case "BUPATI":
              router.replace("/bupati-portal/dashboard");
              break;
            default:
              router.replace("/"); // Fallback kalau role gak dikenal
          }
        }
      } catch (error) {
        // User belum login, aman tetap di halaman ini
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
