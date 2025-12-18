import DynamicMetadata from '@/components/seo/DynamicMetadata'; // ✅ import di sini
import ClientThemeProvider from '@/providers/client-theme-provider';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import PropTypes from 'prop-types';
import { Toaster } from 'sonner';
import './globals.css';
import TanstackQueryProvider from '@/providers/tanstack-query-provider';


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
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen`}
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
