'use client';

import { Button, Select } from 'flowbite-react';
import { HiViewGrid, HiTable } from 'react-icons/hi';

export default function DataFilterBar({
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  viewMode,
  setViewMode,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
      <div className="flex gap-4 flex-wrap">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Semua Status</option>
          <option value="PENDING">PENDING</option>
          <option value="PROSES">PROSES</option>
          <option value="SELESAI">SELESAI</option>
          <option value="DITOLAK">DITOLAK</option>
        </Select>

        <Select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="ALL">Semua Prioritas</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          color={viewMode === 'table' ? 'blue' : 'gray'}
          onClick={() => setViewMode('table')}
        >
          <HiTable className="w-4 h-4 mr-2" />
          Tabel
        </Button>
        <Button
          size="sm"
          color={viewMode === 'grid' ? 'blue' : 'gray'}
          onClick={() => setViewMode('grid')}
        >
          <HiViewGrid className="w-4 h-4 mr-2" />
          Grid
        </Button>
      </div>
    </div>
  );
}
