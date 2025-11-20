import DynamicMetadata from '@/components/seo/DynamicMetadata'; // ✅ import di sini
import ClientThemeProvider from '@/providers/client-theme-provider';
import { Geist, Geist_Mono } from 'next/font/google';
import PropTypes from 'prop-types';
import { Toaster } from 'sonner';
import './globals.css';
import TanstackQueryProvider from '@/providers/tanstack-query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Lapor Kaka Bupati',
  description: 'Sampaikan laporan Anda melalui Lapor Kaka Bupati',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport = {
  themeColor: '#ef4444',
};

export default async function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ClientThemeProvider>
          <TanstackQueryProvider>
            <DynamicMetadata /> {/* ✅ panggil di sini */}
            <Toaster position="top-right" />
            {/* <RouteLoadingIndicator /> */}
            {/* <ScrollToTopButton /> */}
            {/* <FloatingHelper /> */}
            {children}
          </TanstackQueryProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
