'use client';

import AuthProtectGuard from '@/components/AuthProtectedGuard';
import Footer from '@/components/partials/UserCorePartials/footer';
import Header from '@/components/partials/UserCorePartials/header';
import Sidebar from '@/components/partials/UserCorePartials/sidebar';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import PushNotificationManager from '@/components/common/PushNotificationManager';


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
    <AuthProtectGuard allowRole={['BUPATI']}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        {/* <Toaster richColors position="top-right" /> */}
        <div className="flex">
          <Sidebar
            role="bupati"
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <PushNotificationManager />

          <div
            className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'
              }`}
          >
            <Header
              role="bupati"
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />{' '}
            <main className="mt-20 p-6">{children}</main>
            {/* <Footer role="bupati" /> */}
          </div>
        </div>
      </ThemeProvider>
    </AuthProtectGuard>
  );
}
