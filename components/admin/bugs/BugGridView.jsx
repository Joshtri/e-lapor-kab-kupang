'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, Badge, Button } from 'flowbite-react'
import { HiOutlineUser, HiOutlineCalendar, HiOutlineEye, HiOutlineChat } from 'react-icons/hi'

export default function BugGridView({ bugs, formatDate, openCommentModal }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bugs.map((bug) => {
        const dateInfo = formatDate(bug.createdAt)

        return (
          <motion.div
            key={bug.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`border-t-4 ${
                bug.statusProblem === 'OPEN'
                  ? 'border-red-500'
                  : bug.statusProblem === 'IN_PROGRESS'
                  ? 'border-yellow-500'
                  : 'border-green-500'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <Badge color={getStatusBadgeColor(bug.statusProblem)}>
                    {getStatusText(bug.statusProblem)}
                  </Badge>
                  <Badge color={getPriorityBadgeColor(bug.priorityProblem)}>
                    {getPriorityText(bug.priorityProblem)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <HiOutlineCalendar className="h-4 w-4" />
                  <span className="text-xs">{dateInfo.relative}</span>
                </div>
              </div>

              <div className="mt-3">
                <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  {bug.title}
                </h5>
                <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">
                  {bug.description}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <HiOutlineUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bug.user?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {bug.user?.email || 'No email'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link href={`/adm/bugs/${bug.id}`} className="flex-1">
                  <Button color="light" className="w-full">
                    <HiOutlineEye className="mr-2 h-5 w-5" />
                    Lihat Detail
                  </Button>
                </Link>
                <Button
                  color="blue"
                  className="flex-1"
                  onClick={() => openCommentModal(bug.id)}
                >
                  <HiOutlineChat className="mr-2 h-5 w-5" />
                  Komentar
                </Button>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function getStatusBadgeColor(status) {
  return { OPEN: 'red', IN_PROGRESS: 'yellow', RESOLVED: 'green' }[status] || 'gray'
}

function getStatusText(status) {
  return { OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' }[status] || status
}

function getPriorityBadgeColor(priority) {
  return { LOW: 'blue', MEDIUM: 'yellow', HIGH: 'red' }[priority] || 'gray'
}

function getPriorityText(priority) {
  return { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }[priority] || priority
}
