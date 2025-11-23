'use client';

import { Button, Dropdown } from 'flowbite-react';
import { HiOutlineTable, HiOutlineViewGrid, HiPlus } from 'react-icons/hi';
import { CiFilter } from 'react-icons/ci';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// Hook untuk detect desktop screen (sama seperti di ListGrid)
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Set initial value - lg breakpoint adalah 1300px
    setIsDesktop(window.innerWidth >= 1300);

    // Handle resize
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1300);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
};

export default function FilterBar({
  children, // 🔥 custom filter yang kamu input sendiri
  viewMode = 'table',
  setViewMode,
  onCreate,
  createButtonLabel = 'Tambah',
  showCreateButton = true,
}) {
  const isDesktop = useIsDesktop();

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

      {/* 🔃 Switch view mode - HANYA MUNCUL DI DESKTOP */}
      {typeof setViewMode === 'function' && isDesktop && (
        <div className="flex gap-2">
          <Button
            color={viewMode === 'table' ? 'blue' : 'gray'}
            onClick={() => setViewMode('table')}
            size="sm"
          >
            <HiOutlineTable className="mr-2" />
            Tabel
          </Button>
          <Button
            color={viewMode === 'grid' ? 'blue' : 'gray'}
            onClick={() => setViewMode('grid')}
            size="sm"
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

FilterBar.propTypes = {
  // children: custom filter components to be rendered inside the dropdown
  children: PropTypes.node,
  viewMode: PropTypes.oneOf(['table', 'grid']),
  setViewMode: PropTypes.func,
  onCreate: PropTypes.func,
  createButtonLabel: PropTypes.string,
  showCreateButton: PropTypes.bool,
};
