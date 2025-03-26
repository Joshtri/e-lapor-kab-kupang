"use client"

import { useEffect, useState } from "react"
import { Button, Dropdown, Modal, Avatar } from "flowbite-react"
import {
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineDocumentReport,
  HiOutlineHome,
  HiOutlineBell,
  HiOutlineMenuAlt2,
} from "react-icons/hi"
import { useTheme } from "next-themes"
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

const HeaderPelapor = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingNotifications, setLoadingNotifications] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/auth/me")
        setUser(res.data.user)

        const notifRes = await axios.get("/api/notifications")
        setNotifications(notifRes.data.filter((n) => n.link.startsWith("/pelapor/")))
      } catch (err) {
        console.error("Gagal mengambil data:", err)
      } finally {
        setLoadingUser(false)
        setLoadingNotifications(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", null, {
        withCredentials: true,
      })
      toast.success("Berhasil logout! Mengarahkan ke halaman login...")

      setTimeout(() => {
        router.push("/auth/login")
      }, 1000)
    } catch (error) {
      console.error("Logout Error:", error)
      toast.error("Gagal logout. Silakan coba lagi.")
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleNotificationClick = async (notif) => {
    try {
      await axios.post("/api/notifications/read", { notificationId: notif.id })
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)))
      router.push(notif.link)
    } catch (err) {
      console.error("Gagal memperbarui notifikasi:", err)
    }
  }

  const handleCreateReport = () => {
    // If already on dashboard, we'll rely on URL params to trigger the modal
    if (pathname === "/pelapor/dashboard") {
      // Use URL with search params to trigger modal
      router.push("/pelapor/dashboard?openModal=true")
    } else {
      // Navigate to dashboard with param to open modal
      router.push("/pelapor/dashboard?openModal=true")
    }
  }

  return (
    <>
      <header className="fixed w-full z-20 top-0 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          {/* Logo */}
          <Link href="/pelapor/dashboard" className="flex items-center">
            <motion.div
              className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-2"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
            >
              <HiOutlineMail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">Lapor Mail</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Layanan Pengaduan Online</p>
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/pelapor/dashboard"
              className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <HiOutlineHome className="h-4 w-4" />
              <span>Beranda</span>
            </Link>
            <Link
              href="/pelapor/log-laporan"
              className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <HiOutlineDocumentReport className="h-4 w-4" />
              <span>Log Laporan</span>
            </Link>
            <Button
              onClick={handleCreateReport}
              className="flex items-center gap-1 px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <HiPaperAirplane className="h-4 w-4" />
              <span>Buat Laporan</span>
            </Button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Notifications */}
            <div className="relative">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <HiOutlineBell className="h-5 w-5" />
                    </motion.button>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </div>
                }
              >
                <Dropdown.Header>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{unreadCount} baru</span>
                    )}
                  </div>
                </Dropdown.Header>
                <div className="max-h-60 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-4 px-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex justify-center mb-2">
                        <HiMailOpen className="h-6 w-6" />
                      </div>
                      <p>Tidak ada notifikasi</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <Dropdown.Item
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`border-b border-gray-100 dark:border-gray-700 ${
                          !notif.isRead ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`p-2 rounded-full ${
                              !notif.isRead
                                ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            <HiMailOpen className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                !notif.isRead
                                  ? "font-semibold text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{notif.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {new Date(notif.createdAt).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {!notif.isRead && <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
                        </div>
                      </Dropdown.Item>
                    ))
                  )}
                </div>
                <Dropdown.Divider />
                <Dropdown.Item
                  href="#"
                  className="text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Lihat Semua Notifikasi
                </Dropdown.Item>
              </Dropdown>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Toggle Dark Mode"
            >
              {theme === "light" ? (
                <BsMoonStarsFill className="text-gray-700 dark:text-gray-300 text-lg" />
              ) : (
                <BsSunFill className="text-yellow-400 text-lg" />
              )}
            </button>

            {/* User Avatar & Dropdown */}
            <div className="relative">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <div className="relative">
                    <Avatar
                      alt="User Avatar"
                      img={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`}
                      rounded
                      size="sm"
                      className="border-2 border-blue-200 dark:border-blue-800 hover:scale-110 transition-all duration-300"
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {user?.name || "User"}
                  </span>
                  <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                    {user?.email || "user@email.com"}
                  </span>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item icon={HiOutlineUserCircle} onClick={() => router.push("/pelapor/profile")}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item icon={HiMailOpen} onClick={() => router.push("/pelapor/log-laporan")}>
                  Log Laporan
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  icon={HiOutlineLogout}
                  onClick={() => setOpenModal(true)}
                  className="text-red-600 dark:text-red-400"
                >
                  Logout
                </Dropdown.Item>
              </Dropdown>
            </div>

            {/* Toggle Menu Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <HiOutlineMenuAlt2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden px-4 pb-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <Link
                href="/pelapor/dashboard"
                className="flex items-center gap-2 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineHome className="h-5 w-5" />
                <span>Beranda</span>
              </Link>
              <Link
                href="/pelapor/log-laporan"
                className="flex items-center gap-2 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineDocumentReport className="h-5 w-5" />
                <span>Log Laporan</span>
              </Link>
              <Button
                onClick={() => {
                  setMenuOpen(false)
                  handleCreateReport()
                }}
                className="flex items-center gap-2 mt-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors w-full"
              >
                <HiPaperAirplane className="h-5 w-5" />
                <span>Buat Laporan</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modal Logout */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
        <Modal.Header className="border-b-2 border-blue-100 dark:border-blue-900">
          <div className="flex items-center">
            <HiOutlineMail className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Konfirmasi Logout</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <HiPaperAirplane className="h-6 w-6 text-blue-600 dark:text-blue-400 transform rotate-90" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Apakah Anda yakin ingin logout dari akun ini?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleLogout} className="flex items-center gap-2">
            <HiOutlineLogout className="h-4 w-4" />
            Ya, Logout
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default HeaderPelapor

