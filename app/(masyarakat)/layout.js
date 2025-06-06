import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verify } from "jsonwebtoken"
import AuthProtectGuard from "@/components/AuthProtectedGuard"
import ClientThemeProvider from "@/providers/client-theme-provider"
import NextAuthSessionProvider from "@/providers/session-provider"
import ResponsiveLayout from "@/components/pelapor/ResponsiveLayout"

export default function PelaporLayout({ children }) {
  const token = cookies().get("auth_token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  try {
    verify(token, process.env.JWT_SECRET)
  } catch (error) {
    redirect("/auth/login")
  }

  return (
    <AuthProtectGuard allowRole={["PELAPOR"]}>
      <ClientThemeProvider>
        <NextAuthSessionProvider>
          <ResponsiveLayout>{children}</ResponsiveLayout>
        </NextAuthSessionProvider>
      </ClientThemeProvider>
    </AuthProtectGuard>
  )
}
