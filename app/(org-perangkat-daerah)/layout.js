"use client";

import React, { useState } from "react";
 
import ClientThemeProvider from "@/providers/client-theme-provider";
import { Toaster } from "sonner";
import OpdSidebar from "@/components/opd/partials/sidebar";
import OpdHeader from "@/components/opd/partials/header";

export default function OpdLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <ClientThemeProvider>
      <Toaster richColors position="top-right" />
      <div className="flex">
        <OpdSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <OpdHeader toggleSidebar={toggleSidebar} />
          <main className="mt-20 p-6">{children}</main>
          {/* <AdminFooter /> */}
        </div>
      </div>
    </ClientThemeProvider>
  );
}
