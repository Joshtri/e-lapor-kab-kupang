'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/partials/header';
import AdminSidebar from '@/components/admin/partials/sidebar';
import AdminFooter from '@/components/admin/partials/footer';
import { ThemeProvider } from 'next-themes'; // ✅ langsung pakai ini
import { Toaster } from 'sonner';
import AuthProtectGuard from '@/components/AuthProtectedGuard';
import RouteLoadingIndicator from '@/components/ui/RouteLoadingIndicator';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <AuthProtectGuard allowRole={['ADMIN']}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light" // atau "system" kalau kamu mau ikuti preferensi OS
        enableSystem={false}
        storageKey="theme" // ✅ supaya persist
      >
        <div className="flex min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
          <Toaster richColors position="top-right" />
          <RouteLoadingIndicator />

          <AdminSidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isSidebarOpen ? 'ml-64' : 'ml-20'
            }`}
          >
            <AdminHeader toggleSidebar={toggleSidebar} />
            <main className="flex-1 mt-20 p-6">{children}</main>
            <AdminFooter />
          </div>
        </div>
      </ThemeProvider>
    </AuthProtectGuard>
  );
}
