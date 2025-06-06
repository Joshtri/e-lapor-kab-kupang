"use client"
import { HiHome, HiDocumentText, HiChartBar, HiUser } from "react-icons/hi"
import Link from "next/link"
import { usePathname } from "next/navigation"

const FooterMobile = () => {
  const pathname = usePathname()

  // Don't show footer on dashboard page since it has its own bottom navigation
  if (pathname === "/pelapor/dashboard") {
    return null
  }

  const isActive = (path) => {
    return pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="grid grid-cols-4 h-16">
        <Link
          href="/pelapor/dashboard"
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            isActive("/pelapor/dashboard")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <HiHome className="h-5 w-5" />
          <span className="text-xs">Beranda</span>
        </Link>
        <Link
          href="/pelapor/log-laporan"
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            isActive("/pelapor/log-laporan")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <HiDocumentText className="h-5 w-5" />
          <span className="text-xs">Laporan</span>
        </Link>
        <Link
          href="/pelapor/statistik"
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            isActive("/pelapor/statistik")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <HiChartBar className="h-5 w-5" />
          <span className="text-xs">Statistik</span>
        </Link>
        <Link
          href="/pelapor/profile"
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            isActive("/pelapor/profile")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <HiUser className="h-5 w-5" />
          <span className="text-xs">Profil</span>
        </Link>
      </div>
    </div>
  )
}

export default FooterMobile
