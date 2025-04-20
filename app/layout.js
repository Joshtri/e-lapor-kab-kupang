import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import FloatingHelper from '@/components/floating-helpers';
import ClientThemeProvider from '@/providers/client-theme-provider';
import { Toaster } from 'sonner';
import ScrollToTopButton from '@/components/ui/scroll-to-top-button';
import RouteLoadingIndicator from '@/components/ui/RouteLoadingIndicator';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Lapor KK Bupati',
  description: 'Sampaikan laporan Anda melalui Lapor KK Bupati',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport = {
  themeColor: '#ef4444',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <ClientThemeProvider>
          <Toaster position="top-right" />
          <RouteLoadingIndicator />
          <ScrollToTopButton />
          <FloatingHelper />
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
