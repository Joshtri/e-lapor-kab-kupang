'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  HiArrowLeft,
  HiOutlineRefresh,
  HiRefresh,
  HiSearch,
  HiX,
  HiDownload,
} from 'react-icons/hi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import Breadcrumbs from '../BreadCrumbs';
import { Button, Tooltip } from 'flowbite-react';
import PropTypes from 'prop-types';

export default function PageHeader({
  title,
  backHref = '/',
  showSearch = false,
  showBackButton = true,
  showRefreshButton = false,
  searchQuery = '',
  onSearchChange = () => {},
  onRefreshClick = () => {},
  onExportExcel = null,
  onExportPDF = null,
  role = 'adm', // Auto-detect user role for breadcrumbs
  breadcrumbsProps = {}, // Optional: for custom overrides
}) {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showSearchBar) {
      inputRef.current?.focus();
    }
  }, [showSearchBar]);

  return (
    <section className="mb-6">
      <div
        className={`flex flex-wrap items-center gap-4 mb-4 ${
          showBackButton ? 'justify-between' : 'justify-end'
        }`}
      >
        {/* Kembali */}
        {showBackButton && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <HiArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        )}

        {/* Action Bar (sebaris) */}
        <div className="flex items-center gap-2">
          {/* 🔄 Refresh */}
          {showRefreshButton && (
            <Tooltip content="Refresh" position="bottom">
              <Button
                color="blue"
                size="sm"
                onClick={onRefreshClick}
                className="p-2"
              >
                <HiRefresh className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}

          {/* ⬇️ Export Excel */}
          {onExportExcel && (
            <Tooltip content="Export ke Excel" position="bottom">
              <Button
                color="success"
                size="sm"
                onClick={onExportExcel}
                className="p-2"
              >
                <FaFileExcel className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}

          {/* ⬇️ Export PDF */}
          {onExportPDF && (
            <Tooltip content="Export ke PDF" position="bottom">
              <Button
                color="light"
                size="sm"
                onClick={onExportPDF}
                className="p-2"
              >
                <FaFilePdf className="w-4 h-4 text-red-600" />
              </Button>
            </Tooltip>
          )}

          {/* 🔍 Search */}
          {showSearch &&
            (showSearchBar ? (
              <div className="relative w-full md:w-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari..."
                  className="w-full md:w-64 px-4 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
                />
                <button
                  onClick={() => {
                    setShowSearchBar(false);
                    onSearchChange('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Tooltip content="Cari" position="bottom">
                <Button
                  size="sm"
                  color="gray"
                  onClick={() => setShowSearchBar(true)}
                  className="p-2"
                >
                  <HiSearch className="w-5 h-5" />
                </Button>
              </Tooltip>
            ))}
        </div>
      </div>

      <Breadcrumbs {...breadcrumbsProps} role={role} />
      <hr className="mt-4" />

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4">
        {title}
      </h1>
    </section>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  backHref: PropTypes.string,
  showSearch: PropTypes.bool,
  showBackButton: PropTypes.bool,
  showRefreshButton: PropTypes.bool,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  onRefreshClick: PropTypes.func,
  onExportExcel: PropTypes.func,
  onExportPDF: PropTypes.func,
  role: PropTypes.oneOf(['adm', 'bupati', 'opd', 'pelapor']),
  breadcrumbsProps: PropTypes.object,
};
