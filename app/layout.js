import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/partials/header";
import FloatingHelper from "@/components/floating-helpers";
// import { ThemeProvider } from 'next-themes'
// import { Flowbite } from 'flowbite-react'
import ClientThemeProvider from "@/providers/client-theme-provider";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientThemeProvider>
          <Header/>
          <FloatingHelper/>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
