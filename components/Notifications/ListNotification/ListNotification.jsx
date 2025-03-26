"use client"

import { useState, useEffect } from "react"
import { Table, Badge, Button, Card, Spinner, Pagination, TextInput, Select } from "flowbite-react"
import {
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineExclamation,
  HiOutlineInbox ,
  HiOutlineFilter,
} from "react-icons/hi"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export default function NotificationList() {
  // State for notifications and UI
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("list") // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRead, setFilterRead] = useState("all") // 'all', 'read', 'unread'
  const [filterRole, setFilterRole] = useState("all") // 'all', 'ADMIN', 'BUPATI', etc.

  const itemsPerPage = 10

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      })

      if (filterRead !== "all") {
        queryParams.append("isRead", filterRead === "read")
      }

      if (filterRole !== "all") {
        queryParams.append("role", filterRole)
      }

      const response = await fetch(`/api/notifications/list?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()

      setNotifications(data.notifications || data)

      // If the API returns pagination info
      if (data.pagination) {
        setTotalPages(Math.ceil(data.pagination.total / itemsPerPage))
      } else {
        // Estimate total pages based on returned items
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Gagal memuat notifikasi")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [currentPage, filterRead, filterRole])

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchNotifications()
  }

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/mark-read/${notificationId}`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )

      toast.success("Notifikasi ditandai sebagai telah dibaca")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Gagal menandai notifikasi sebagai telah dibaca")
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete notification")
      }

      // Update local state
      setNotifications(notifications.filter((notification) => notification.id !== notificationId))

      toast.success("Notifikasi berhasil dihapus")
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Gagal menghapus notifikasi")
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      formatted: format(date, "dd MMM yyyy, HH:mm", { locale: id }),
      relative: formatDistanceToNow(date, { addSuffix: true, locale: id }),
    }
  }

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-blue-500 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <HiOutlineBell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Notifikasi</h1>
            <p className="text-gray-600 dark:text-gray-300">Lihat dan kelola semua notifikasi</p>
          </div>
        </div>
      </motion.div>

      {/* Filters and search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiOutlineSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <TextInput
                type="text"
                placeholder="Cari notifikasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              <Button type="submit" color="blue" className="absolute right-0 top-0 bottom-0 rounded-l-none">
                Cari
              </Button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1">
              <HiOutlineFilter className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Filter:</span>
            </div>

            <Select value={filterRead} onChange={(e) => setFilterRead(e.target.value)} className="w-auto">
              <option value="all">Semua Status</option>
              <option value="read">Telah Dibaca</option>
              <option value="unread">Belum Dibaca</option>
            </Select>

            <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-auto">
              <option value="all">Semua Pengirim</option>
              <option value="ADMIN">Admin</option>
              <option value="BUPATI">Bupati</option>
              <option value="OPD">OPD</option>
              <option value="PELAPOR">Pelapor</option>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button color={viewMode === "list" ? "blue" : "gray"} onClick={() => setViewMode("list")}>
                <HiOutlineViewList className="mr-2 h-5 w-5" />
                List
              </Button>
              <Button color={viewMode === "grid" ? "blue" : "gray"} onClick={() => setViewMode("grid")}>
                <HiOutlineViewGrid className="mr-2 h-5 w-5" />
                Grid
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="w-16">Status</Table.HeadCell>
              <Table.HeadCell>Pesan</Table.HeadCell>
              <Table.HeadCell>Pengirim</Table.HeadCell>
              <Table.HeadCell>Tanggal</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {notifications.map((notification) => {
                const dateInfo = formatDate(notification.createdAt)

                return (
                  <Table.Row
                    key={notification.id}
                    className={`${!notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    <Table.Cell>
                      <div className="flex justify-center">
                        {notification.isRead ? (
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                            <HiOutlineInbox className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        ) : (
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <HiOutlineInbox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell
                      className={`font-medium ${!notification.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      <div>
                        <p>{notification.message}</p>
                        {notification.link && (
                          <Link
                            href={notification.link.replace("[id]", notification.id)}
                            className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1 inline-block"
                          >
                            Lihat Detail
                          </Link>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-medium">{notification.user?.name || "System"}</span>
                        <Badge color={getRoleBadgeColor(notification.user?.role)}>
                          {notification.user?.role || "SYSTEM"}
                        </Badge>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span>{dateInfo.formatted}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{dateInfo.relative}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button color="success" size="xs" onClick={() => markAsRead(notification.id)}>
                            <HiOutlineCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {notification.link && (
                          <Link href={notification.link.replace("[id]", notification.id)}>
                            <Button color="light" size="xs">
                              <HiOutlineEye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Button color="failure" size="xs" onClick={() => deleteNotification(notification.id)}>
                          <HiOutlineTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>

          {notifications.length === 0 && (
            <div className="p-8 text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full inline-block mb-4">
                <HiOutlineBell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Tidak ada notifikasi</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Anda belum memiliki notifikasi atau tidak ada notifikasi yang cocok dengan filter Anda.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((notification) => {
            const dateInfo = formatDate(notification.createdAt)

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`border-t-4 ${!notification.isRead ? "border-blue-500" : "border-gray-300 dark:border-gray-600"} hover:shadow-lg transition-shadow`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {notification.isRead ? (
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                          <HiOutlineInbox  className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      ) : (
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <HiOutlineInbox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <Badge color={notification.isRead ? "gray" : "blue"}>
                        {notification.isRead ? "Telah Dibaca" : "Belum Dibaca"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{dateInfo.formatted}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{dateInfo.relative}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p
                      className={`text-lg font-bold tracking-tight ${!notification.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {notification.message}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <div className={`p-2 rounded-full ${getRoleBgColor(notification.user?.role)}`}>
                        <HiOutlineExclamation className={`h-4 w-4 ${getRoleTextColor(notification.user?.role)}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notification.user?.name || "System"}
                        </p>
                        <Badge color={getRoleBadgeColor(notification.user?.role)}>
                          {notification.user?.role || "SYSTEM"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {!notification.isRead && (
                      <Button color="success" onClick={() => markAsRead(notification.id)} className="flex-1">
                        <HiOutlineCheck className="mr-2 h-5 w-5" />
                        Tandai Dibaca
                      </Button>
                    )}
                    {notification.link && (
                      <Link href={notification.link.replace("[id]", notification.id)} className="flex-1">
                        <Button color="light" className="w-full">
                          <HiOutlineEye className="mr-2 h-5 w-5" />
                          Lihat Detail
                        </Button>
                      </Link>
                    )}
                    <Button color="failure" onClick={() => deleteNotification(notification.id)} className="flex-1">
                      <HiOutlineTrash className="mr-2 h-5 w-5" />
                      Hapus
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}

          {notifications.length === 0 && (
            <div className="col-span-full">
              <Card className="p-8 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full inline-block mb-4">
                  <HiOutlineBell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Tidak ada notifikasi</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Anda belum memiliki notifikasi atau tidak ada notifikasi yang cocok dengan filter Anda.
                </p>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showIcons />
        </div>
      )}
    </div>
  )
}

// Helper functions for styling based on role
function getRoleBadgeColor(role) {
  switch (role) {
    case "ADMIN":
      return "purple"
    case "BUPATI":
      return "green"
    case "OPD":
      return "indigo"
    case "PELAPOR":
      return "blue"
    default:
      return "gray"
  }
}

function getRoleBgColor(role) {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 dark:bg-purple-900"
    case "BUPATI":
      return "bg-green-100 dark:bg-green-900"
    case "OPD":
      return "bg-indigo-100 dark:bg-indigo-900"
    case "PELAPOR":
      return "bg-blue-100 dark:bg-blue-900"
    default:
      return "bg-gray-100 dark:bg-gray-700"
  }
}

function getRoleTextColor(role) {
  switch (role) {
    case "ADMIN":
      return "text-purple-600 dark:text-purple-400"
    case "BUPATI":
      return "text-green-600 dark:text-green-400"
    case "OPD":
      return "text-indigo-600 dark:text-indigo-400"
    case "PELAPOR":
      return "text-blue-600 dark:text-blue-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

