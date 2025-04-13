'use client';

export default function DataGrid({ data, renderItem, modals = null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((item) => renderItem(item))}
      {modals}
    </div>
  );
}
