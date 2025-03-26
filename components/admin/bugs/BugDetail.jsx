"use client"

import { useState, useEffect } from "react"
import { Button, Card, Spinner, Badge, Select, Alert } from "flowbite-react"
import {
    
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineRefresh,
} from "react-icons/hi";

import { FaBug } from "react-icons/fa";

import { motion } from "framer-motion"
import { toast } from "sonner"
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import BugComments from "@/components/admin/bugs/BugComments"

export default function BugDetail({ bugId, currentUser }) {
  const [bug, setBug] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  // Fetch bug details
  const fetchBugDetails = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/bugs/${bugId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch bug details")
      }

      const data = await response.json()
      setBug(data)
      setNewStatus(data.status)
    } catch (error) {
      console.error("Error fetching bug details:", error)
      toast.error("Gagal memuat detail bug")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchBugDetails()
  }, [bugId])

  // Update bug status
  const updateBugStatus = async () => {
    if (newStatus === bug.status) return

    try {
      setUpdating(true)

      const response = await fetch(`/api/bugs/${bugId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statusProblem: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update bug status")
      }

      const updatedBug = await response.json()
      setBug(updatedBug)

      toast.success(`Status bug berhasil diubah menjadi ${getStatusText(newStatus)}`)
    } catch (error) {
      console.error("Error updating bug status:", error)
      toast.error("Gagal mengubah status bug")
    } finally {
      setUpdating(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      formatted: format(date, "dd MMMM yyyy, HH:mm", { locale: id }),
      relative: formatDistanceToNow(date, { addSuffix: true, locale: id }),
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!bug) {
    return (
      <Alert color="failure">
        <div className="flex items-center gap-3">
          <HiOutlineExclamation className="h-6 w-6" />
          <span className="font-medium">Bug tidak ditemukan</span>
        </div>
      </Alert>
    )
  }

  const createdDate = formatDate(bug.createdAt)
  const updatedDate = formatDate(bug.updatedAt)

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-red-500 mb-6"
      >
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <FaBug className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{bug.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge color={getStatusBadgeColor(bug.status)}>{getStatusText(bug.status)}</Badge>
                <Badge color={getPriorityBadgeColor(bug.priority)}>{getPriorityText(bug.priority)}</Badge>
              </div>
            </div>
          </div>

          {/* Status update form for admins */}
          {currentUser && (currentUser.role === "ADMIN" || currentUser.role === "BUPATI") && (
            <div className="flex items-center gap-2">
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={updating}
                className="w-auto"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </Select>
              <Button
                color="blue"
                onClick={updateBugStatus}
                disabled={updating || newStatus === bug.status}
                isProcessing={updating}
              >
                {updating ? (
                  "Updating..."
                ) : (
                  <>
                    <HiOutlineRefresh className="mr-2 h-5 w-5" />
                    Update Status
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bug details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left side - Bug description */}
        <div className="md:col-span-2">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Deskripsi Bug</h5>
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">{bug.description}</div>

            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <HiOutlineUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dilaporkan oleh:</p>
                  <p className="font-medium">{bug.user?.name || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <HiOutlineCalendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dilaporkan pada:</p>
                  <p className="font-medium">{createdDate.formatted}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{createdDate.relative}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <HiOutlineRefresh className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Terakhir diupdate:</p>
                  <p className="font-medium">{updatedDate.formatted}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{updatedDate.relative}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right side - Status info */}
        <div className="md:col-span-1">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Status Bug</h5>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${getStatusBgColor(bug.status)}`}>
                  {bug.status === "RESOLVED" ? (
                    <HiOutlineCheck className={`h-6 w-6 ${getStatusTextColor(bug.status)}`} />
                  ) : (
                    <FaBug className={`h-6 w-6 ${getStatusTextColor(bug.status)}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status saat ini:</p>
                  <p className="font-medium text-lg">{getStatusText(bug.status)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${getPriorityBgColor(bug.priority)}`}>
                  <HiOutlineExclamation className={`h-6 w-6 ${getPriorityTextColor(bug.priority)}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prioritas:</p>
                  <p className="font-medium text-lg">{getPriorityText(bug.priority)}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Status Info:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-red-100 dark:bg-red-900 p-1 rounded-full mt-0.5">
                      <FaBug className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Open:</span> Bug baru dilaporkan dan belum ditangani.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-1 rounded-full mt-0.5">
                      <HiOutlineRefresh className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">In Progress:</span> Bug sedang dalam proses perbaikan.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-1 rounded-full mt-0.5">
                      <HiOutlineCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Resolved:</span> Bug telah diperbaiki dan ditutup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Comments section */}
      <div id="comments">
        <BugComments bugId={bugId} currentUser={currentUser} />
      </div>
    </div>
  )
}

// Helper functions for styling based on status and priority
function getStatusBadgeColor(status) {
  switch (status) {
    case "OPEN":
      return "red"
    case "IN_PROGRESS":
      return "yellow"
    case "RESOLVED":
      return "green"
    default:
      return "gray"
  }
}

function getStatusText(status) {
  switch (status) {
    case "OPEN":
      return "Open"
    case "IN_PROGRESS":
      return "In Progress"
    case "RESOLVED":
      return "Resolved"
    default:
      return status
  }
}

function getStatusBgColor(status) {
  switch (status) {
    case "OPEN":
      return "bg-red-100 dark:bg-red-900"
    case "IN_PROGRESS":
      return "bg-yellow-100 dark:bg-yellow-900"
    case "RESOLVED":
      return "bg-green-100 dark:bg-green-900"
    default:
      return "bg-gray-100 dark:bg-gray-700"
  }
}

function getStatusTextColor(status) {
  switch (status) {
    case "OPEN":
      return "text-red-600 dark:text-red-400"
    case "IN_PROGRESS":
      return "text-yellow-600 dark:text-yellow-400"
    case "RESOLVED":
      return "text-green-600 dark:text-green-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

function getPriorityBadgeColor(priority) {
  switch (priority) {
    case "LOW":
      return "blue"
    case "MEDIUM":
      return "yellow"
    case "HIGH":
      return "red"
    default:
      return "gray"
  }
}

function getPriorityText(priority) {
  switch (priority) {
    case "LOW":
      return "Low"
    case "MEDIUM":
      return "Medium"
    case "HIGH":
      return "High"
    default:
      return priority
  }
}

function getPriorityBgColor(priority) {
  switch (priority) {
    case "LOW":
      return "bg-blue-100 dark:bg-blue-900"
    case "MEDIUM":
      return "bg-yellow-100 dark:bg-yellow-900"
    case "HIGH":
      return "bg-red-100 dark:bg-red-900"
    default:
      return "bg-gray-100 dark:bg-gray-700"
  }
}

function getPriorityTextColor(priority) {
  switch (priority) {
    case "LOW":
      return "text-blue-600 dark:text-blue-400"
    case "MEDIUM":
      return "text-yellow-600 dark:text-yellow-400"
    case "HIGH":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

