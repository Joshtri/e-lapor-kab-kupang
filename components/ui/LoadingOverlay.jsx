'use client';

import { Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';

export default function LoadingOverlay({ message = 'Memuat data...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center"
      >
        <Spinner
          size="xl"
          color="info"
          className="text-blue-600 dark:text-blue-500"
        />
        <span className="mt-4 font-medium text-gray-700 dark:text-gray-200">
          {message}
        </span>
      </motion.div>
    </div>
  );
}
