'use client';

import { useState } from 'react';
import { Table, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import EmptyState from '@/components/ui/empty-state';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = 'No data available',
  actionButtons = [],
  onRowClick,
  rowClassName,
  isSelectable = false,
  pagination = null,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (id) => {
    if (isSelectable) {
      setSelectedRows((prev) =>
        prev.includes(id)
          ? prev.filter((rowId) => rowId !== id)
          : [...prev, id],
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700"
    >
      <Table
        hoverable
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
      >
        <Table.Head className="bg-gray-50 dark:bg-gray-800">
          {isSelectable && (
            <Table.HeadCell className="w-10 px-4 py-3">
              <input
                type="checkbox"
                className="rounded"
                onChange={() => {
                  if (selectedRows.length === data.length) {
                    setSelectedRows([]);
                  } else {
                    setSelectedRows(data.map((item) => item.id));
                  }
                }}
                checked={selectedRows.length === data.length && data.length > 0}
              />
            </Table.HeadCell>
          )}
          {columns.map((column, index) => (
            <Table.HeadCell
              key={index}
              className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                column.width ? column.width : ''
              }`}
            >
              {column.header}
            </Table.HeadCell>
          ))}
          {actionButtons.length > 0 && (
            <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Aksi
            </Table.HeadCell>
          )}
        </Table.Head>
        <Table.Body className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <Table.Row
              key={row.id || rowIndex}
              className={`transition-colors duration-150 ${
                typeof rowClassName === 'function'
                  ? rowClassName(row)
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {isSelectable && (
                <Table.Cell
                  className="w-10 px-4 py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </Table.Cell>
              )}
              {columns.map((column, colIndex) => (
                <Table.Cell
                  key={colIndex}
                  className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                >
                  {column.cell ? column.cell(row) : row[column.accessor]}
                </Table.Cell>
              ))}
              {actionButtons.length > 0 && (
                <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-1">
                    {actionButtons.map((ActionButton, btnIndex) => (
                      <div key={btnIndex} onClick={(e) => e.stopPropagation()}>
                        {typeof ActionButton === 'function'
                          ? ActionButton(row)
                          : ActionButton}
                      </div>
                    ))}
                  </div>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {pagination && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {pagination}
        </div>
      )}
    </motion.div>
  );
};

export default DataTable;
