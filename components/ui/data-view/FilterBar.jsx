'use client';

import { Button, Dropdown } from 'flowbite-react';
import { HiOutlineTable, HiOutlineViewGrid, HiPlus } from 'react-icons/hi';
import { CiFilter } from 'react-icons/ci';

export default function FilterBar({
  children, // 🔥 custom filter yang kamu input sendiri
  viewMode = 'table',
  setViewMode,
  onCreate,
  createButtonLabel = 'Tambah',
  showCreateButton = true,
}) {
  return (
    <div className="flex flex-wrap items-center w-full gap-4">
      {/* 🔽 Filter Dropdown (kontennya disediakan oleh children) */}
      {children && (
        <Dropdown
          label={<CiFilter className="text-2xl" />}
          inline
          arrowIcon={false}
          dismissOnClick={false}
        >
          {children}
        </Dropdown>
      )}

      {/* 🔃 Switch view mode */}
      {setViewMode && (
        <div className="flex gap-2">
          <Button
            color={viewMode === 'table' ? 'blue' : 'gray'}
            onClick={() => setViewMode('table')}
          >
            <HiOutlineTable className="mr-2" />
            Tabel
          </Button>
          <Button
            color={viewMode === 'grid' ? 'blue' : 'gray'}
            onClick={() => setViewMode('grid')}
          >
            <HiOutlineViewGrid className="mr-2" />
            Grid
          </Button>
        </div>
      )}

      {/* ➕ Tombol tambah */}
      {showCreateButton && (
        <div className="ml-auto">
          <Button color="blue" onClick={onCreate}>
            <HiPlus className="mr-2" />
            {createButtonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
