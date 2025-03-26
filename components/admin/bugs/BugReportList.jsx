'use client'

import { useState, useEffect } from 'react'
import {
  Table, Badge, Button, Card, Spinner, Pagination, TextInput, Select,
} from 'flowbite-react'
import {
  HiOutlineSearch, HiOutlineViewGrid, HiOutlineViewList, HiOutlineEye,
  HiOutlineChat, HiOutlineFilter, HiOutlineCalendar, HiOutlineUser, HiOutlinePlus,
} from 'react-icons/hi'
import { FaBug } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

import BugTableView from './BugTableView'
import BugGridView from './BugGridView'
import BugCommentCreateModal from './BugCommentCreateModal'

// === Helper Functions ===
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return {
    formatted: format(date, 'dd MMM yyyy, HH:mm', { locale: id }),
    relative: formatDistanceToNow(date, { addSuffix: true, locale: id }),
  }
}

const getStatusBadgeColor = (status) =>
  ({ OPEN: 'red', IN_PROGRESS: 'yellow', RESOLVED: 'green' }[status] || 'gray')

const getStatusText = (status) =>
  ({ OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' }[status] || status)

const getPriorityBadgeColor = (priority) =>
  ({ LOW: 'blue', MEDIUM: 'yellow', HIGH: 'red' }[priority] || 'gray')

const getPriorityText = (priority) =>
  ({ LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }[priority] || priority)

export default function BugReportList() {
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [selectedBugId, setSelectedBugId] = useState(null)

  const currentUser = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  }

  const itemsPerPage = 10

  const fetchBugs = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
        search: searchQuery,
      })

      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterPriority !== 'all') params.append('priority', filterPriority)

      const res = await fetch(`/api/bugs?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()

      setBugs(data)
      setTotalPages(Math.ceil(data.length / itemsPerPage))
    } catch (err) {
      toast.error('Gagal memuat laporan bug')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBugs()
  }, [currentPage, filterStatus, filterPriority])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchBugs()
  }

  const openCommentModal = (bugId) => {
    setSelectedBugId(bugId)
    setIsCommentModalOpen(true)
  }

  const closeCommentModal = () => {
    setIsCommentModalOpen(false)
    setSelectedBugId(null)
  }

  const renderEmptyState = (
    <div className="p-8 text-center">
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full inline-block mb-4">
        <FaBug className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        Tidak ada laporan bug
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        Tidak ditemukan atau tidak sesuai dengan filter Anda.
      </p>
    </div>
  )

  if (loading && bugs.length === 0) {
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-red-500 mb-6"
      >
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <FaBug className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan Bug</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Lihat dan kelola semua laporan bug dari pengguna
              </p>
            </div>
          </div>
          <Link href="/adm/bugs/create">
            <Button color="red" className="flex items-center gap-2">
              <HiOutlinePlus className="h-5 w-5" />
              Tambah Bug Report
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <TextInput
              type="text"
              placeholder="Cari laporan bug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiOutlineSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <Button
              type="submit"
              color="red"
              className="absolute right-0 top-0 bottom-0 rounded-l-none"
            >
              Cari
            </Button>
          </div>

          <div className="flex gap-2 items-center">
            <HiOutlineFilter className="text-gray-500 dark:text-gray-400" />
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Semua Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </Select>

            <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">Semua Prioritas</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>

            <Button color={viewMode === 'list' ? 'red' : 'gray'} onClick={() => setViewMode('list')}>
              <HiOutlineViewList className="mr-2 h-5 w-5" /> List
            </Button>
            <Button color={viewMode === 'grid' ? 'red' : 'gray'} onClick={() => setViewMode('grid')}>
              <HiOutlineViewGrid className="mr-2 h-5 w-5" /> Grid
            </Button>
          </div>
        </form>
      </div>

      {/* View Modes */}
      {viewMode === 'list'
        ? <BugTableView bugs={bugs} formatDate={formatDate} openCommentModal={openCommentModal} />
        : <BugGridView bugs={bugs} formatDate={formatDate} openCommentModal={openCommentModal} />
      }

      {bugs.length === 0 && renderEmptyState}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}

      <BugCommentCreateModal
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
        bugId={selectedBugId}
        currentUser={currentUser}
      />
    </div>
  )
}
