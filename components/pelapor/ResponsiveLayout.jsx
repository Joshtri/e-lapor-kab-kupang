"use client"

import { useIsMobile } from "@/hooks/use-media-query"
import HeaderPelapor from "@/components/pelapor/partials/header"
import FooterPelapor from "@/components/pelapor/partials/footer"
import HeaderMobile from "@/components/pelapor/partials/HeaderPelaporMobile"
import FooterMobile from "@/components/pelapor/partials/FooterPelaporMobile"
import { useSession } from "next-auth/react"

export default function ResponsiveLayout({ children }) {
  const isMobile = useIsMobile()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-gray-900">
      {isMobile ? <HeaderMobile user={user} /> : <HeaderPelapor />}
      <main className={`flex-grow ${isMobile ? "pt-14 pb-16" : "pt-16"}`}>{children}</main>
      {isMobile ? <FooterMobile /> : <FooterPelapor />}
    </div>
  )
}
