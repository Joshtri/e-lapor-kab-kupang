'use client';

import FilterBar from '@/components/ui/data-view/FilterBar';
import EmptyState from '@/components/ui/empty-state';
import LoadingMail from '@/components/ui/loading/LoadingMail';
import PageHeader from '@/components/ui/PageHeader';
import { Button, Table } from 'flowbite-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Pagination = ({
  totalItems,
  currentPage,
  pageSize = 10,
  onPageChange,
  className = '',
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange(newPage);
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
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
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const ListGrid = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = 'No data available',
  emptyAction = null,
  actionButtons = [],
  onRowClick,
  rowClassName,
  viewMode = 'table',
  setViewMode = () => {},
  gridComponent = null,
  pagination = null,
  paginationProps = {
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    onPageChange: () => {},
  },
  filtersComponent = null,
  searchBar = false,
  searchQuery = '',
  onSearchChange = () => {},
  title = 'Data List',
  backHref = '/',
  showBackButton = true,
  showRefreshButton = false,
  onRefreshClick = () => {},
  onExportExcel = null,
  onExportPDF = null,
  breadcrumbsProps = {},
  onCreate = () => {},
  createButtonLabel = 'Tambah',
  showCreateButton = true,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (value) => {
    setInternalSearchQuery(value);
    onSearchChange(value);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingMail />;
    }

    if (!data.length) {
      return <EmptyState message={emptyMessage}>{emptyAction}</EmptyState>;
    }

    if (viewMode === 'grid' && gridComponent) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          {gridComponent}
        </motion.div>
      );
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
            {columns.map((column, index) => (
              <Table.HeadCell
                key={index}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.width || ''}`}
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
            {data.map((row, rowIndex) => {
              const resolvedRowClass =
                typeof rowClassName === 'function'
                  ? rowClassName(row)
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50';

              return (
                <Table.Row
                  key={row.id || rowIndex}
                  className={`transition-colors duration-150 ${resolvedRowClass}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => {
                    const cellContent = column.cell
                      ? column.cell(row)
                      : row[column.accessor];
                    return (
                      <Table.Cell
                        key={colIndex}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                      >
                        {cellContent}
                      </Table.Cell>
                    );
                  })}
                  {actionButtons.length > 0 && (
                    <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        {actionButtons.map((ActionButton, btnIndex) => (
                          <div
                            key={btnIndex}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {typeof ActionButton === 'function'
                              ? ActionButton(row)
                              : ActionButton}
                          </div>
                        ))}
                      </div>
                    </Table.Cell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        backHref={backHref}
        showSearch={searchBar}
        showBackButton={showBackButton}
        showRefreshButton={showRefreshButton}
        searchQuery={internalSearchQuery}
        onSearchChange={handleSearchChange}
        onRefreshClick={onRefreshClick}
        onExportExcel={onExportExcel}
        onExportPDF={onExportPDF}
        breadcrumbsProps={breadcrumbsProps}
      />

      {(filtersComponent || viewMode) && (
        <FilterBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCreate={onCreate}
          createButtonLabel={createButtonLabel}
          showCreateButton={showCreateButton}
        >
          {filtersComponent}
        </FilterBar>
      )}

      {renderContent()}

      {pagination || (
        <Pagination
          totalItems={paginationProps.totalItems}
          currentPage={paginationProps.currentPage}
          pageSize={paginationProps.pageSize}
          onPageChange={paginationProps.onPageChange}
          className="mt-4"
        />
      )}
    </div>
  );
};

ListGrid.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  emptyAction: PropTypes.node,
  actionButtons: PropTypes.array,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  viewMode: PropTypes.string,
  setViewMode: PropTypes.func,
  gridComponent: PropTypes.node,
  pagination: PropTypes.node,
  paginationProps: PropTypes.shape({
    totalItems: PropTypes.number,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    onPageChange: PropTypes.func,
  }),
  filtersComponent: PropTypes.node,
  searchBar: PropTypes.bool,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  title: PropTypes.string,
  backHref: PropTypes.string,
  showBackButton: PropTypes.bool,
  showRefreshButton: PropTypes.bool,
  onRefreshClick: PropTypes.func,
  onExportExcel: PropTypes.func,
  onExportPDF: PropTypes.func,
  breadcrumbsProps: PropTypes.object,
  onCreate: PropTypes.func,
  createButtonLabel: PropTypes.string,
  showCreateButton: PropTypes.bool,
};

export default ListGrid;
