'use client';

import { ThemeProvider } from 'next-themes';

export default function ClientThemeProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme"
    >
      {children}
    </ThemeProvider>
  );
}
