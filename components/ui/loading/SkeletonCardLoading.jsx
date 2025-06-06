"use client"

import { HiOutlineMail } from "react-icons/hi"
import { motion } from "framer-motion"

export default function SkeletonCardLoading({ label }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
      <div className="flex flex-col items-center justify-center">
        {/* Animated Mail Icon */}
        <motion.div
          animate={{
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="mb-4"
        >
          <HiOutlineMail className="h-12 w-12 text-blue-400 dark:text-blue-300" />
        </motion.div>

        {/* Skeleton Text Lines */}
        <div className="w-full max-w-sm space-y-3">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-blue-100 dark:bg-blue-900 rounded w-1/2 mx-auto"></div>
            <div className="h-3 bg-blue-100 dark:bg-blue-900 rounded w-2/3 mx-auto"></div>
          </div>
        </div>

        {/* Loading Label - only shown if label is passed */}
        {label && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 text-center font-medium"
          >
            {label}
          </motion.p>
        )}

        {/* Skeleton Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
