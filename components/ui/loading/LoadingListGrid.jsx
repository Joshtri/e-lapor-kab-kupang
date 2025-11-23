'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Skeleton Loader Component for ListGrid
const LoadingListGrid = ({
  viewMode = 'table',
  columnCount = 4,
  rowCount = 6,
  isDesktop = true,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Premium shimmer animation with better gradient
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0%', '-200% 0%'],
    },
  };

  // Skeleton Pulse with proper shimmer
  const SkeletonPulse = ({ width = 'w-full', height = 'h-4', radius = 'rounded' }) => (
    <motion.div
      className={`${width} ${height} ${radius} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]`}
      variants={shimmerVariants}
      animate="animate"
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      }}
    />
  );

  // Table View Skeleton
  const TableSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <table className="w-full table-auto">
        <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {Array.from({ length: columnCount }).map((_, idx) => (
              <th key={idx} className="px-4 py-4 min-w-[150px]">
                <SkeletonPulse height="h-3" width="w-full" radius="rounded-md" />
              </th>
            ))}
            <th className="px-4 py-4 min-w-[120px]">
              <SkeletonPulse height="h-3" width="w-full" radius="rounded-md" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {Array.from({ length: rowCount }).map((_, rowIdx) => (
            <motion.tr
              key={rowIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIdx * 0.1 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {Array.from({ length: columnCount }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-4 min-w-[150px]">
                  <div className="space-y-2">
                    <SkeletonPulse
                      height="h-3"
                      width="w-full"
                      radius="rounded-md"
                    />
                    <SkeletonPulse
                      height="h-2"
                      width="w-4/5"
                      radius="rounded-md"
                    />
                  </div>
                </td>
              ))}
              <td className="px-4 py-4 min-w-[120px]">
                <div className="flex gap-2">
                  <motion.div
                    className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700"
                    variants={shimmerVariants}
                    animate="animate"
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'linear',
                    }}
                  />
                  <motion.div
                    className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700"
                    variants={shimmerVariants}
                    animate="animate"
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'linear',
                      delay: 0.2,
                    }}
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );

  // Grid View Skeleton
  const GridSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array.from({ length: rowCount }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header Section with Title */}
          <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between gap-3">
              <SkeletonPulse height="h-5" width="w-3/4" radius="rounded-md" />
              <motion.div
                className="h-6 w-12 rounded-full bg-gray-200 dark:bg-gray-700"
                variants={shimmerVariants}
                animate="animate"
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              />
            </div>
            <SkeletonPulse height="h-3" width="w-full" radius="rounded-md" />
            <SkeletonPulse height="h-3" width="w-5/6" radius="rounded-md" />
          </div>

          {/* Content Section */}
          <div className="space-y-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <SkeletonPulse height="h-2" width="w-1/3" radius="rounded-md" className="mb-2" />
              <SkeletonPulse height="h-3" width="w-full" radius="rounded-md" />
            </div>
            <div>
              <SkeletonPulse height="h-2" width="w-1/4" radius="rounded-md" className="mb-2" />
              <SkeletonPulse height="h-3" width="w-4/5" radius="rounded-md" />
            </div>
          </div>

          {/* Footer Section */}
          <div className="space-y-3 pt-4">
            <SkeletonPulse height="h-2" width="w-1/4" radius="rounded-md" />
            <SkeletonPulse height="h-3" width="w-3/4" radius="rounded-md" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
            {Array.from({ length: 3 }).map((_, btnIdx) => (
              <motion.div
                key={btnIdx}
                className="h-9 w-9 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
                variants={shimmerVariants}
                animate="animate"
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                  delay: btnIdx * 0.1,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Mobile Card Skeleton
  const MobileCardSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      {Array.from({ length: rowCount }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          {/* Primary Info */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <SkeletonPulse height="h-2" width="w-1/3" radius="rounded-md" className="mb-3" />
            <SkeletonPulse height="h-5" width="w-full" radius="rounded-md" />
          </div>

          {/* Secondary Info */}
          <div className="space-y-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <SkeletonPulse height="h-2" width="w-1/4" radius="rounded-md" className="mb-2" />
              <SkeletonPulse height="h-3" width="w-full" radius="rounded-md" />
            </div>
            <div>
              <SkeletonPulse height="h-2" width="w-1/4" radius="rounded-md" className="mb-2" />
              <SkeletonPulse height="h-3" width="w-4/5" radius="rounded-md" />
            </div>
          </div>

          {/* Additional Info Expandable */}
          <div className="py-3">
            <SkeletonPulse height="h-3" width="w-2/5" radius="rounded-md" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            {Array.from({ length: 2 }).map((_, btnIdx) => (
              <motion.div
                key={btnIdx}
                className="h-8 w-8 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
                variants={shimmerVariants}
                animate="animate"
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                  delay: btnIdx * 0.1,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Render based on view mode
  if (!isDesktop) {
    return <MobileCardSkeleton />;
  }

  if (viewMode === 'grid') {
    return <GridSkeleton />;
  }

  return <TableSkeleton />;
};

export default LoadingListGrid;
