'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import HeaderBupati from '@/components/bupati/partials/header';
import FooterBupati from '@/components/bupati/partials/footer';
import { Toaster } from 'sonner';
import AuthProtectGuard from '@/components/AuthProtectedGuard';
import BupatiSidebar from '@/components/bupati/partials/sidebar';

export default function BupatiLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Pastikan komponen hanya dirender di client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Hindari error SSR

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>


      <Toaster richColors position="top-right" />
      <div className="flex">
        <BupatiSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <HeaderBupati toggleSidebar={toggleSidebar} />
          <main className="mt-20 p-6">{children}</main>
          <FooterBupati />
        </div>
      </div>
    </ThemeProvider>
  );
}
