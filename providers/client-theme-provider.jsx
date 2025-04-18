'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export default function ClientThemeProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme"
    >
      <Toaster richColors position="top-right" />
      {children}
    </ThemeProvider>
  );
}
