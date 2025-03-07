"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import HeaderBupati from "@/components/bupati/partials/header";
import FooterBupati from "@/components/bupati/partials/footer";
import { Toaster } from "sonner";
import AuthProtectGuard from "@/components/AuthProtectedGuard";

export default function BupatiLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  // Pastikan komponen hanya dirender di client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Hindari error SSR

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Toaster untuk notifikasi global */}
        <Toaster richColors position="top-right" />

        {/* Header Bupati */}
        <HeaderBupati />
        <AuthProtectGuard>
          {/* Konten Utama */}
          <main className="flex-grow p-4 pt-16">{children}</main>
        </AuthProtectGuard>

        {/* Footer Bupati */}
        <FooterBupati />
      </div>
    </ThemeProvider>
  );
}
