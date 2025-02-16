"use client"

import { ThemeProvider } from 'next-themes'
import { Flowbite } from 'flowbite-react'

export default function ClientThemeProvider({ children }) {
  return (
    <ThemeProvider attribute="class" enableSystem>
      <Flowbite>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          {children}
        </div>
      </Flowbite>
    </ThemeProvider>
  )
}