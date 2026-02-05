'use client';

import { useEffect, useState } from 'react';

import AuthProtectGuard from '@/components/AuthProtectedGuard';
import Footer from '@/components/partials/UserCorePartials/footer';
import Header from '@/components/partials/UserCorePartials/header';
import Sidebar from '@/components/partials/UserCorePartials/sidebar';
import PushNotificationManager from '@/components/common/PushNotificationManager';

import ClientThemeProvider from '@/providers/client-theme-provider';

export default function OpdLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (!mounted) return null; // ⛔️ Cegah render sebelum client siap

  return (
    <AuthProtectGuard allowRole={['OPD']}>
      <ClientThemeProvider>
        <div className="flex">
          <Sidebar
            role="opd"
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <PushNotificationManager />

          <div
            className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'
              }`}
          >
            <Header
              role="opd"
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />
            <main className="mt-20 p-6">{children}</main>
            <Footer role="opd" />

          </div>
        </div>
      </ClientThemeProvider>
    </AuthProtectGuard>
  );
}
