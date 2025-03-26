import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import FloatingHelper from '@/components/floating-helpers';
import ClientThemeProvider from '@/providers/client-theme-provider';
import { Toaster } from 'sonner';
import { UserProvider } from '@/contexts/UserContext';
import ScrollToTopButton from '@/components/ui/scroll-to-top-button';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

 

export const metadata = {
  title: 'E-LAPOR',
  description: 'Sampaikan laporan Anda melalui E-LAPOR',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png'
  }
}

export const viewport = {
  themeColor: '#ef4444'
}



export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen`}
      >
        <UserProvider>
          <ClientThemeProvider>
            <Toaster position="top-right" />
            <ScrollToTopButton />
            <FloatingHelper />
            {children}
          </ClientThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
