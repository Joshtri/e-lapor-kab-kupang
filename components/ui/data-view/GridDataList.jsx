'use client';

import { motion } from 'framer-motion';

export default function GridDataList({
  data = [],
  renderItem,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  emptyMessage = 'Tidak ada data ditemukan',
  className = '',
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        {emptyMessage}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid ${columns} gap-6 ${className}`}
    >
      {data.map((item, index) => (
        <div key={item.id || index}>{renderItem(item)}</div>
      ))}
    </motion.div>
  );
}
