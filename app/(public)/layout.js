import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/partials/header";
import FloatingHelper from "@/components/floating-helpers";
import ClientThemeProvider from "@/providers/client-theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-LAPOR",
  description: "Sampaikan laporan Anda melalui E-LAPOR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientThemeProvider>
          <Toaster position="top-right" />
          <Header />
          <FloatingHelper />
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
