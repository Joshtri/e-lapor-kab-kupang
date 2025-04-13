'use client';

import Link from 'next/link';
import { Table, Button, Badge } from 'flowbite-react';
import {
  HiOutlineEye,
  HiOutlineChat,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlinePencil,
} from 'react-icons/hi';

export default function BugTableView({
  bugs,
  formatDate,
  openCommentModal,
  openEditModal,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Judul</Table.HeadCell>
          <Table.HeadCell>Pelapor</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Prioritas</Table.HeadCell>
          <Table.HeadCell>Tanggal</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {bugs.map((bug) => {
            const dateInfo = formatDate(bug.createdAt);

            return (
              <Table.Row
                key={bug.id}
                className={
                  bug.statusProblem === 'OPEN'
                    ? 'bg-red-50 dark:bg-red-900/10'
                    : ''
                }
              >
                <Table.Cell className="font-medium text-gray-900 dark:text-white">
                  <div>
                    <p className="truncate max-w-[250px]">{bug.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px]">
                      {bug.description.substring(0, 100)}...
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full">
                      <HiOutlineUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{bug.user?.name || 'Unknown'}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={getStatusBadgeColor(bug.statusProblem)}>
                    {getStatusText(bug.statusProblem)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={getPriorityBadgeColor(bug.priorityProblem)}>
                    {getPriorityText(bug.priorityProblem)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <HiOutlineCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm">{dateInfo.formatted}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {dateInfo.relative}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Link href={`/adm/bugs/${bug.id}`}>
                      <Button color="light" size="xs">
                        <HiOutlineEye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      color="blue"
                      size="xs"
                      onClick={() => openCommentModal(bug.id)}
                    >
                      <HiOutlineChat className="h-4 w-4" />
                    </Button>

                    <Button
                      color="gray"
                      size="xs"
                      onClick={() => openEditModal(bug)} // Tambahkan handler ini
                    >
                      <HiOutlinePencil className="h-4 w-4" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}

function getStatusBadgeColor(status) {
  return (
    { OPEN: 'red', IN_PROGRESS: 'yellow', RESOLVED: 'green' }[status] || 'gray'
  );
}

function getStatusText(status) {
  return (
    { OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' }[
      status
    ] || status
  );
}

function getPriorityBadgeColor(priority) {
  return { LOW: 'blue', MEDIUM: 'yellow', HIGH: 'red' }[priority] || 'gray';
}

function getPriorityText(priority) {
  return { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }[priority] || priority;
}
