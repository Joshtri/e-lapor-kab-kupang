'use client';

import FilterBar from '@/components/ui/datatable/FilterBar';
import EmptyState from '@/components/ui/EmptyState';
import LoadingListGrid from '@/components/ui/loading/LoadingListGrid';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import PageHeader from '@/components/ui/PageHeader';
import { getRoleHomePath } from '@/config/breadcrumbConfig';
import { Button, Table, Card, Tooltip } from 'flowbite-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import {
  HiTrash,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineChatAlt2,
} from 'react-icons/hi';
import ActionsButton from '@/components/ui/ActionsButton';
import RowActionsMenu from '@/components/ui/datatable/RowActionsMenu';

// Preset Action Buttons
export const ActionButtonsPresets = {
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete',
  COMMENT: 'comment',
};

// Hook untuk detect desktop screen (lg breakpoint dan keatas)
// Mobile dan tablet = card grid, Desktop lg+ = table
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Set initial value - lg breakpoint adalah 1024px
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

// Function untuk normalize action buttons (support string shortcuts + custom objects)
const getNormalizedActionButton = (buttonDef, context) => {
  const {
    item,
    onViewClick,
    onEditClick,
    onCommentClick,
    onDeleteClick,
    basePath,
  } = context;

  // Jika string, convert ke preset button
  if (typeof buttonDef === 'string') {
    const btnType = buttonDef.toLowerCase();

    if (btnType === ActionButtonsPresets.DELETE) {
      // Only render DELETE button if onDeleteClick handler exists
      if (!onDeleteClick) {
        console.warn('DELETE button requires onDeleteClick prop to be passed to ListGrid');
        return null;
      }

      return (
        <ActionsButton
          key="delete"
          icon={HiTrash}
          tooltip="Hapus"
          color="red"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(item);
          }}
        />
      );
    }

    if (btnType === ActionButtonsPresets.VIEW) {
      return (
        <ActionsButton
          key="view"
          icon={HiOutlineEye}
          tooltip="Lihat Detail"
          color="blue"
          onClick={(e) => {
            e.stopPropagation();
            // Auto-navigate if basePath provided, otherwise use callback
            if (basePath) {
              window.location.href = `/${basePath}/${item.id}`;
            } else {
              onViewClick?.(item);
            }
          }}
        />
      );
    }

    if (btnType === ActionButtonsPresets.EDIT) {
      return (
        <ActionsButton
          key="edit"
          icon={HiOutlinePencilAlt}
          tooltip="Edit"
          color="amber"
          onClick={(e) => {
            e.stopPropagation();
            // Auto-navigate if basePath provided, otherwise use callback
            if (basePath) {
              window.location.href = `/${basePath}/${item.id}/edit`;
            } else {
              onEditClick?.(item);
            }
          }}
        />
      );
    }

    if (btnType === ActionButtonsPresets.COMMENT) {
      return (
        <ActionsButton
          key="comment"
          icon={HiOutlineChatAlt2}
          tooltip="Komentar"
          color="purple"
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick?.(item);
          }}
        />
      );
    }
  }

  // Jika object, convert ke custom row action
  if (typeof buttonDef === 'object' && buttonDef?.icon) {
    const {
      icon: Icon,
      onClick,
      variant = 'outline',
      tooltip,
      color,
      label, // Support untuk label text
    } = buttonDef;

    // Jika ada label, render Button dengan icon dan text
    if (label) {
      const buttonElement = (
        <Button
          size="xs"
          color={color || 'gray'}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(item);
          }}
          className="flex items-center gap-1.5"
        >
          {Icon && <Icon className="w-4 h-4" />}
          <span>{label}</span>
        </Button>
      );

      // Jika ada tooltip, wrap dengan Tooltip
      if (tooltip) {
        return (
          <Tooltip content={tooltip} placement="top">
            {buttonElement}
          </Tooltip>
        );
      }

      return buttonElement;
    }

    // Jika tidak ada label, gunakan ActionsButton (icon only)
    return (
      <ActionsButton
        icon={Icon}
        tooltip={tooltip}
        color={color || 'gray'}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(item);
        }}
      />
    );
  }

  // Jika function, gunakan langsung
  if (typeof buttonDef === 'function') {
    return buttonDef(item);
  }

  return null;
};

// Auto-generate grid component dari columns dengan advanced styling
const AutoGeneratedGrid = ({
  data,
  columns,
  actionButtons = [],
  rowActions = [],
  renderActionButton,
}) => {
  // Group columns by section
  const headerColumns = columns.filter(
    (col) => col.gridSection === 'header' || !col.gridSection,
  );
  const footerColumns = columns.filter((col) => col.gridSection === 'footer');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {data.map((item, idx) => (
        <motion.div
          key={item.id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-full hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg dark:hover:shadow-blue-900/20 transition-all duration-300 flex flex-col">
            {/* Header Section */}
            <div className="space-y-3 flex-1">
              {headerColumns.map((col, colIdx) => {
                const content = col.cell ? col.cell(item) : item[col.accessor];
                const isHighlight = col.gridHighlight;

                return (
                  <div
                    key={colIdx}
                    className={
                      colIdx === 0
                        ? ''
                        : 'border-t border-gray-200 dark:border-gray-700 pt-3'
                    }
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {col.header}
                    </p>
                    <div
                      className={
                        isHighlight
                          ? 'font-semibold text-gray-900 dark:text-gray-100'
                          : 'text-sm text-gray-700 dark:text-gray-300'
                      }
                    >
                      {content}
                    </div>

                    {/* Conditional Badge */}
                    {col.gridBadge && col.gridBadge.show(item) && (
                      <span
                        className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          col.gridBadge.colorClass ||
                          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}
                      >
                        {col.gridBadge.text}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Section */}
            {footerColumns.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                {footerColumns.map((col, colIdx) => (
                  <div key={colIdx}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {col.header}
                    </p>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {col.cell ? col.cell(item) : item[col.accessor]}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {(actionButtons.length > 0 || rowActions.length > 0) && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-4 flex gap-2 flex-wrap items-center">
                {/* Standard action buttons */}
                {actionButtons.map((buttonDef, btnIdx) => (
                  <div key={btnIdx} onClick={(e) => e.stopPropagation()}>
                    {renderActionButton(buttonDef, item)}
                  </div>
                ))}
                {/* Row actions dropdown menu */}
                {rowActions.length > 0 && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <RowActionsMenu actions={rowActions} item={item} />
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

AutoGeneratedGrid.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  actionButtons: PropTypes.array,
  rowActions: PropTypes.array,
  renderActionButton: PropTypes.func.isRequired,
};

// Component untuk render filters dari array config
const AutoFilters = ({ filters, onResetFilters }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="p-4 space-y-3">
      {filters.map((filter, idx) => {
        if (filter.type === 'select') {
          return (
            <div key={idx}>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {filter.label}
              </label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
              >
                {filter.options?.map((opt, optIdx) => (
                  <option key={optIdx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        if (filter.type === 'text') {
          return (
            <div key={idx}>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {filter.label}
              </label>
              <input
                type="text"
                placeholder={filter.placeholder}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
              />
            </div>
          );
        }
        return null;
      })}
      <Button color="gray" className="w-full" onClick={onResetFilters}>
        Reset Semua Filter
      </Button>
    </div>
  );
};

AutoFilters.propTypes = {
  filters: PropTypes.array,
  onResetFilters: PropTypes.func,
};

// Mobile Card Grid Component
const MobileCardGrid = ({
  data,
  columns,
  actionButtons,
  rowActions,
  onRowClick,
  renderActionButton,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {data.map((row, rowIndex) => (
        <motion.div
          key={row.id || rowIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rowIndex * 0.05 }}
          onClick={() => onRowClick && onRowClick(row)}
          className="cursor-pointer"
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <div className="space-y-3">
              {/* Primary Info (from first column) */}
              {columns.length > 0 && (
                <div className="border-b pb-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    {columns[0].header}
                  </p>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1 break-words">
                    {columns[0].cell
                      ? columns[0].cell(row)
                      : row[columns[0].accessor]}
                  </div>
                </div>
              )}

              {/* Secondary Info */}
              <div className="space-y-2">
                {columns.slice(1, 3).map((column, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      {column.header}
                    </p>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 break-words">
                      {column.cell ? column.cell(row) : row[column.accessor]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info (overflow) */}
              {columns.length > 3 && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                    Lihat selengkapnya ({columns.length - 3})
                  </summary>
                  <div className="mt-2 space-y-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                    {columns.slice(3).map((column, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          {column.header}
                        </p>
                        <div className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 break-words">
                          {column.cell
                            ? column.cell(row)
                            : row[column.accessor]}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              {(actionButtons.length > 0 || rowActions.length > 0) && (
                <div className="border-t pt-3 flex gap-2 flex-wrap items-center">
                  {/* Standard action buttons */}
                  {actionButtons.map((buttonDef, btnIndex) => (
                    <div
                      key={btnIndex}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0"
                    >
                      {renderActionButton(buttonDef, row)}
                    </div>
                  ))}
                  {/* Row actions dropdown menu */}
                  {rowActions.length > 0 && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <RowActionsMenu actions={rowActions} item={row} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

MobileCardGrid.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  actionButtons: PropTypes.array,
  rowActions: PropTypes.array,
  onRowClick: PropTypes.func,
  renderActionButton: PropTypes.func.isRequired,
};

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
  emptyDescription = 'Tidak ada data untuk ditampilkan saat ini.',
  emptyIcon = null,
  actionButtons = [], // Standard actions: VIEW, EDIT, DELETE, CREATE
  rowActions = [], // Custom row actions: [{ icon, onClick, variant, tooltip }, ...]
  onRowClick,
  rowClassName,
  viewMode = 'table',
  setViewMode = () => {},
  gridComponent = null,
  pageSize = 10, // Default page size
  showPageSizeSelector = false, // Enable page size selector dropdown
  pageSizeOptions = [10, 25, 50, 75, 100], // Available page size options
  // Filters as array config
  filters = null,
  // Auto-navigation for standard action buttons
  basePath = null, // e.g., "adm/kelola-pengaduan" - auto-generates VIEW and EDIT navigation
  // Callbacks untuk preset action buttons (fallback if basePath not provided)
  onViewClick = null,
  onEditClick = null,
  onCommentClick = null,
  onDeleteClick = null,
  // Other props
  searchBar = false,
  searchQuery = '',
  onSearchChange = () => {},
  title = 'Data List',
  description = '', // Optional description below title
  backHref = '/',
  showBackButton = true,
  showRefreshButton = false,
  onRefreshClick = () => {},
  onExportExcel = null,
  onExportPDF = null,
  role = 'adm',
  breadcrumbsProps = {},
  onCreate = () => {},
  createButtonLabel = 'Tambah',
  showCreateButton = true,
  // Legacy props (backward compatibility)
  filtersComponent = null,
  paginationProps = null,
  onResetFilters = null,
  emptyAction = null,
  customActions = [],
}) => {
  // Auto-generate backHref based on role if not explicitly provided
  const defaultBackHref = getRoleHomePath(role)?.href || '/';
  const finalBackHref = backHref === '/' ? defaultBackHref : backHref;

  // Internal pagination state management
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);

  // Internal viewMode state (support both controlled and uncontrolled mode)
  const [internalViewMode, setInternalViewMode] = useState('table');
  const isDesktop = useIsDesktop();

  // Determine if this is controlled or uncontrolled mode
  const isControlledMode = viewMode !== undefined && typeof setViewMode === 'function';

  // Use controlled viewMode if provided, otherwise use internal state
  const currentViewMode = isControlledMode ? viewMode : internalViewMode;

  // Handler for view mode change (memoized for stable reference)
  const handleViewModeChange = useCallback(
    (newMode) => {
      if (isControlledMode) {
        // Controlled mode: call parent's setter
        setViewMode(newMode);
      } else {
        // Uncontrolled mode: use internal state
        setInternalViewMode(newMode);
      }
    },
    [isControlledMode, setViewMode]
  );

  // Auto reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleSearchChange = (value) => {
    setInternalSearchQuery(value);
    onSearchChange(value);
  };

  const handlePageSizeChange = (newSize) => {
    setCurrentPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Auto-reset filters handler
  const handleAutoResetFilters = useCallback(() => {
    if (filters && Array.isArray(filters)) {
      filters.forEach((filter) => {
        if (filter.type === 'select') {
          filter.onChange('ALL');
        } else if (filter.type === 'text') {
          filter.onChange('');
        }
      });
      setCurrentPage(1);
    }
    // Call custom reset handler if provided (legacy support)
    if (onResetFilters) {
      onResetFilters();
    }
  }, [filters, onResetFilters]);

  // Keep action buttons and row actions separate
  // actionButtons: standard preset actions (VIEW, EDIT, DELETE)
  // rowActions: custom actions that will be shown in dropdown menu

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / currentPageSize);
  const paginatedData = data.slice(
    (currentPage - 1) * currentPageSize,
    currentPage * currentPageSize,
  );

  // Context untuk normalize action buttons
  const actionButtonContext = {
    onViewClick,
    onEditClick,
    onCommentClick,
    onDeleteClick,
    basePath,
  };

  // Function untuk render action button (support string shortcuts + custom functions)
  const renderActionButton = (buttonDef, item) => {
    return getNormalizedActionButton(buttonDef, {
      item,
      ...actionButtonContext,
    });
  };

  // Normalize action buttons - convert string presets + keep custom functions
  // Also merge with customActions (legacy support)
  const allActionButtons = [...actionButtons, ...customActions];
  const normalizedActionButtons = allActionButtons.map((btn) =>
    typeof btn === 'string' ? btn : btn,
  );

  // Determine filters component to render
  const renderFiltersComponent = () => {
    if (filters && Array.isArray(filters)) {
      return (
        <AutoFilters
          filters={filters}
          onResetFilters={handleAutoResetFilters}
        />
      );
    }
    return filtersComponent;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingListGrid
            viewMode={currentViewMode}
            columnCount={columns.length}
            rowCount={data.length || 6}
            isDesktop={isDesktop}
          />
          <LoadingScreen isLoading={loading} />
        </>
      );
    }

    // Auto-render EmptyState using EmptyState component
    if (!data.length) {
      return (
        <EmptyState
          message={emptyMessage}
          description={emptyDescription}
          icon={emptyIcon}
        >
          {emptyAction}
        </EmptyState>
        // <>kontol</>
      );
    }

    // Mobile & Tablet view - automatic card grid
    if (!isDesktop) {
      return (
        <MobileCardGrid
          data={paginatedData}
          columns={columns}
          actionButtons={allActionButtons}
          rowActions={rowActions}
          onRowClick={onRowClick}
          renderActionButton={renderActionButton}
        />
      );
    }

    // Desktop grid view (lg and above)
    if (currentViewMode === 'grid') {
      // Use custom gridComponent if provided, otherwise auto-generate
      if (gridComponent) {
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
      // Auto-generate grid from columns
      return (
        <AutoGeneratedGrid
          data={paginatedData}
          columns={columns}
          actionButtons={allActionButtons}
          rowActions={rowActions}
          renderActionButton={renderActionButton}
        />
      );
    }

    // Desktop table view (lg and above)
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
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.width || 'min-w-fit'}`}
              >
                {column.header}
              </Table.HeadCell>
            ))}
            {(allActionButtons.length > 0 || rowActions.length > 0) && (
              <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[80px]">
                Aksi
              </Table.HeadCell>
            )}
          </Table.Head>

          <Table.Body className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, rowIndex) => {
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
                        className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${column.width || 'min-w-fit'}`}
                      >
                        {cellContent}
                      </Table.Cell>
                    );
                  })}
                  {(allActionButtons.length > 0 || rowActions.length > 0) && (
                    <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* Standard action buttons */}
                        {allActionButtons.map((buttonDef, btnIndex) => (
                          <div
                            key={btnIndex}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {renderActionButton(buttonDef, row)}
                          </div>
                        ))}
                        {/* Row actions dropdown menu */}
                        {rowActions.length > 0 && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <RowActionsMenu actions={rowActions} item={row} />
                          </div>
                        )}
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
        description={description}
        backHref={finalBackHref}
        showSearch={searchBar}
        showBackButton={showBackButton}
        showRefreshButton={showRefreshButton}
        searchQuery={internalSearchQuery}
        onSearchChange={handleSearchChange}
        onRefreshClick={onRefreshClick}
        onExportExcel={onExportExcel}
        onExportPDF={onExportPDF}
        role={role}
        breadcrumbsProps={breadcrumbsProps}
      />

      {/* FilterBar: Always render if filters exist, or if create button shown, or if on desktop (for view mode toggle) */}
      <FilterBar
        viewMode={currentViewMode}
        setViewMode={handleViewModeChange}
        onCreate={onCreate}
        createButtonLabel={createButtonLabel}
        showCreateButton={showCreateButton}
      >
        {renderFiltersComponent()}
      </FilterBar>

      {renderContent()}

      {/* Pagination and Page Size Selector */}
      {(totalPages > 1 || (showPageSizeSelector && totalItems > 0)) && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Page Size Selector */}
          {showPageSizeSelector && totalItems > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Tampilkan:
              </span>
              <select
                value={currentPageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} data
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                dari {totalItems} total
              </span>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              totalItems={totalItems}
              currentPage={currentPage}
              pageSize={currentPageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

ListGrid.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  emptyDescription: PropTypes.string,
  emptyIcon: PropTypes.elementType,
  emptyAction: PropTypes.node, // Legacy
  actionButtons: PropTypes.array,
  rowActions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      onClick: PropTypes.func.isRequired,
      tooltip: PropTypes.string,
      color: PropTypes.string,
      variant: PropTypes.oneOf(['outline', 'solid']),
    }),
  ),
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  viewMode: PropTypes.string, // Optional: if not provided, uses internal state
  setViewMode: PropTypes.func, // Optional: if not provided, uses internal state
  gridComponent: PropTypes.node,
  pageSize: PropTypes.number,
  showPageSizeSelector: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  basePath: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
      options: PropTypes.array,
      placeholder: PropTypes.string,
    }),
  ),
  searchBar: PropTypes.bool,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  backHref: PropTypes.string,
  showBackButton: PropTypes.bool,
  showRefreshButton: PropTypes.bool,
  onRefreshClick: PropTypes.func,
  onExportExcel: PropTypes.func,
  onExportPDF: PropTypes.func,
  role: PropTypes.oneOf(['adm', 'bupati', 'opd', 'pelapor']),
  breadcrumbsProps: PropTypes.object,
  onCreate: PropTypes.func,
  createButtonLabel: PropTypes.string,
  showCreateButton: PropTypes.bool,
  onViewClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onCommentClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  // Legacy props
  filtersComponent: PropTypes.node,
  paginationProps: PropTypes.object,
  onResetFilters: PropTypes.func,
  customActions: PropTypes.array, // Legacy
};

export default ListGrid;
