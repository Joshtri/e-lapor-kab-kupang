'use client';

import { useState } from 'react';
import TableRenderer from './TableRenderer';
import GridRenderer from './GridRenderer';

export default function DataListView({
  data = [],
  viewMode = 'table',
  columnConfig = [],
  actions = [],
  renderGridItem = null,
}) {
  const [internalViewMode, setInternalViewMode] = useState(viewMode);

  return (
    <>
      {data.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Tidak ada data tersedia.
        </div>
      ) : internalViewMode === 'table' ? (
        <TableRenderer
          data={filteredData}
          columnConfig={config.columns}
          actions={config.actions || []}
          viewMode={viewMode}
          renderGridItem={config.renderItem}
        />
      ) : (
        <GridRenderer data={data} renderItem={renderGridItem} />
      )}
    </>
  );
}
