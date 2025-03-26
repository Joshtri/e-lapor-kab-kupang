'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/partials/header';
import AdminSidebar from '@/components/admin/partials/sidebar';
import AdminFooter from '@/components/admin/partials/footer';
import ClientThemeProvider from '@/providers/client-theme-provider';
import { Toaster } from 'sonner';
import AuthProtectGuard from '@/components/AuthProtectedGuard';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <AuthProtectGuard  allowRole={['ADMIN']}>
      <ClientThemeProvider>
        <Toaster richColors position="top-right" />
        <div className="flex">
          <AdminSidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <div
            className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
              isSidebarOpen ? 'ml-64' : 'ml-20'
            }`}
          >
            <AdminHeader toggleSidebar={toggleSidebar} />
            <main className="mt-20 p-6">{children}</main>
            <AdminFooter />
          </div>
        </div>
      </ClientThemeProvider>
    </AuthProtectGuard>
  );
}
