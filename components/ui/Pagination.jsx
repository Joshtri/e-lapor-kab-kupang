'use client';

import { Button } from 'flowbite-react';
import PropTypes from 'prop-types';

export default function Pagination({
  totalItems,
  currentPage,
  pageSize = 10,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange(newPage);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        color="gray"
        size="sm"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &larr; Sebelumnya
      </Button>

      <div className="text-sm text-gray-700 dark:text-gray-200 px-4">
        Halaman <strong>{currentPage}</strong> dari{' '}
        <strong>{totalPages}</strong>
      </div>

      <Button
        color="gray"
        size="sm"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Selanjutnya &rarr;
      </Button>
    </div>
  );
}

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};
