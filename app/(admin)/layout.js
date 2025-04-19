'use client';

import AuthProtectGuard from '@/components/AuthProtectedGuard';
import Footer from '@/components/partials/UserCorePartials/footer';
import Header from '@/components/partials/UserCorePartials/header';
import Sidebar from '@/components/partials/UserCorePartials/sidebar';
import RouteLoadingIndicator from '@/components/ui/RouteLoadingIndicator';
import ClientThemeProvider from '@/providers/client-theme-provider';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <AuthProtectGuard allowRole={['ADMIN']}>
      <ClientThemeProvider>
        <div className="flex min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
          <RouteLoadingIndicator />

          <Sidebar
            role="admin"
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isSidebarOpen ? 'ml-64' : 'ml-20'
            }`}
          >
            <Header
              role="admin"
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />

            <main className="flex-1 mt-20 p-6">{children}</main>
            <Footer role="admin" />
            </div>
        </div>
      </ClientThemeProvider>
    </AuthProtectGuard>
  );
}
