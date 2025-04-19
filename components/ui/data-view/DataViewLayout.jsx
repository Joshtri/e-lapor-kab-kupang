'use client';
import PageHeader from '@/components/ui/PageHeader';
import ListGrid from '@/components/ui/data-view/ListGrid';

export default function DataViewLayout({
  title,
  searchQuery,
  onSearchChange,
  onExportClick,
  onRefreshClick,
  onCreateClick,
  childrenAboveTable,
  filterComponent,
  tableProps,
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        showSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onExportExcel={onExportClick}
        showRefreshButton
        onRefreshClick={onRefreshClick}
      >
        {onCreateClick && (
          <button
            onClick={onCreateClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Tambah Data
          </button>
        )}
      </PageHeader>

      {filterComponent && filterComponent}

      {childrenAboveTable && childrenAboveTable}

      <ListGrid {...tableProps} />
    </div>
  );
}
