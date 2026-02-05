'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from 'flowbite-react';

export const getColumns = () => [
  {
    header: 'Waktu Kirim',
    accessor: 'dateSent',
    cell: (log) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 dark:text-white">
          {log.dateSent
            ? format(new Date(log.dateSent), 'dd MMMM yyyy', { locale: id })
            : '-'}
        </span>
        <span className="text-xs text-gray-500">
          {log.dateSent ? format(new Date(log.dateSent), 'HH:mm:ss') : '-'}
        </span>
      </div>
    ),
  },
  {
    header: 'Dari',
    accessor: 'from',
    cell: (log) => (
      <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
        {log.from.replace('whatsapp:', '')}
      </span>
    ),
  },
  {
    header: 'Ke',
    accessor: 'to',
    cell: (log) => (
      <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
        {log.to.replace('whatsapp:', '')}
      </span>
    ),
  },
  {
    header: 'Pesan',
    accessor: 'body',
    cell: (log) => (
      <div className="max-w-xs truncate" title={log.body}>
        {log.body}
      </div>
    ),
  },
  {
    header: 'Status',
    accessor: 'status',
    cell: (log) => {
      const statusColors = {
        queued: 'gray',
        sent: 'info',
        delivered: 'success',
        read: 'success',
        failed: 'failure',
        undelivered: 'failure',
      };
      return (
        <Badge
          color={statusColors[log.status] || 'gray'}
          className="capitalize"
        >
          {log.status}
        </Badge>
      );
    },
  },
];
