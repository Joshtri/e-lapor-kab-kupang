'use client';

import { Table } from 'flowbite-react';

export default function DataTable({ data = [], columns = [], actions = [], rowClassName = () => '' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <Table hoverable className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Header */}
        <Table.Head className="bg-gray-50 dark:bg-gray-800">
          {columns.map((col) => (
            <Table.HeadCell key={col.key} className={col.className}>
              {col.header}
            </Table.HeadCell>
          ))}
          {actions.length > 0 && <Table.HeadCell className="text-center">Aksi</Table.HeadCell>}
        </Table.Head>

        {/* Body */}
        <Table.Body className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row) => (
            <Table.Row key={row.id} className={rowClassName(row)}>
              {columns.map((col) => (
                <Table.Cell key={col.key} className={col.cellClassName}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </Table.Cell>
              ))}

              {actions.length > 0 && (
                <Table.Cell>
                  <div className="flex items-center gap-2 justify-center">
                    {actions.map((action, i) => (
                      <action.Component key={i} row={row} />
                    ))}
                  </div>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
