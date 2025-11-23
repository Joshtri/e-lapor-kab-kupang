'use client';

import { Badge } from 'flowbite-react';
import {
  HiPaperAirplane,
  HiOutlineExclamationCircle,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useOpdList } from './hooks';

const Step3 = ({ formData, files, categoryMap, priorityMap }) => {
  const { data: opds = [] } = useOpdList();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'failure';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
            <HiPaperAirplane className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Konfirmasi Pengaduan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Periksa kembali pengaduan Anda sebelum dikirim
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Judul Pengaduan */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Judul Pengaduan:
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {formData.title}
              </p>
            </div>

            {/* Kategori */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Kategori:
              </p>
              <Badge color="info" className="w-fit">
                {categoryMap[formData.category] || formData.category}
              </Badge>
            </div>

            {/* Prioritas */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Prioritas:
              </p>
              <Badge color={getPriorityColor(formData.priority)}>
                {priorityMap[formData.priority] || formData.priority}
              </Badge>
            </div>

            {/* OPD Tujuan */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                OPD Tujuan:
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {opds.find((opd) => opd.id === formData.opdId)
                  ?.name || '-'}
              </p>
            </div>

            {/* Lokasi */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Lokasi:
              </p>
              <p className="text-gray-900 dark:text-white">
                {formData.location}
              </p>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Deskripsi Pengaduan:
            </p>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-gray-900 dark:text-white whitespace-pre-line text-sm">
                {formData.description}
              </p>
            </div>
          </div>

          {/* Lampiran */}
          {files.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Lampiran ({files.length}):
              </p>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <HiOutlinePhotograph className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start">
            <HiOutlineExclamationCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>
              Dengan mengirim pengaduan ini, Anda menyatakan bahwa informasi
              yang diberikan adalah benar dan dapat dipertanggungjawabkan.
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Step3;
