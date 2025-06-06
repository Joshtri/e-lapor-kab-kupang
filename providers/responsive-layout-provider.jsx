"use client";

import { createContext, useContext } from "react";
import { useIsMobile } from "@/hooks/use-media-query";

// Membuat context
const ResponsiveLayoutContext = createContext(undefined);

// Hook untuk mengakses context
export function useResponsiveLayout() {
  const context = useContext(ResponsiveLayoutContext);
  if (context === undefined) {
    throw new Error("useResponsiveLayout must be used within a ResponsiveLayoutProvider");
  }
  return context;
}

// Provider component
export function ResponsiveLayoutProvider({ children }) {
  const isMobile = useIsMobile();

  return (
    <ResponsiveLayoutContext.Provider value={{ isMobile }}>
      {children}
    </ResponsiveLayoutContext.Provider>
  );
}