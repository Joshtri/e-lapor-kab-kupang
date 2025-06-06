'use client';

import { formatDateIndo } from '@/utils/common';
import { Avatar, Badge, Tooltip } from 'flowbite-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  HiMailOpen,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineTag,
} from 'react-icons/hi';

export default function ReportsSection() {
  const [reports, setReports] = useState([]);
  const [expandedReports, setExpandedReports] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/public/reports/latest');
        const data = await res.json();
        setReports(data);
      } catch (error) {
        'Gagal mengambil laporan terbaru', error;
      }
    };

    fetchReports();
  }, []);

  const toggleExpand = (id) => {
    setExpandedReports((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const currentMonthLabel = formatDateIndo(new Date(), 'MMMM yyyy');

  return (
    <div className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <HiMailOpen className="text-blue-600 dark:text-blue-300 h-6 w-6" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-white">
            Laporan Terbaru
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Berikut adalah laporan pada bulan{' '}
            <span className="font-medium">{currentMonthLabel}</span> oleh
            Pemerintah Kabupaten Kupang.
          </p>
        </motion.div>

        {reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center"
          >
            <p className="text-gray-500 dark:text-gray-300">
              Belum ada laporan selesai bulan ini.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    img={`https://ui-avatars.com/api/?name=${encodeURIComponent(report.user?.name || 'Pelapor')}&background=random&color=fff&size=128&bold=true&font-size=0.5`}
                    alt={report.user?.name || 'Pelapor'}
                    size="sm"
                    rounded
                    className="shadow-md"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <HiOutlineCalendar className="h-3 w-3" />
                          {formatDateIndo(report.createdAt)}

                          <span className="ml-2">
                            • Ditujukan ke: {report.opd?.name || 'OPD'}
                          </span>
                        </div>
                      </div>

                      <Tooltip content={report.bupatiStatus}>
                        <Badge
                          color={
                            report.bupatiStatus === 'SELESAI'
                              ? 'success'
                              : 'warning'
                          }
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <HiOutlineCheckCircle className="h-3 w-3" />
                          <span>
                            {report.bupatiStatus === 'SELESAI'
                              ? 'Selesai'
                              : 'Proses'}
                          </span>
                        </Badge>
                      </Tooltip>
                    </div>

                    <div className="mt-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {report.title}
                      </h4>

                      <AnimatePresence>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: expandedReports[report.id]
                              ? 'auto'
                              : report.description?.length > 100
                                ? '2.5rem'
                                : 'auto',
                            opacity: 1,
                          }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {report.description}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                      {report.description?.length > 100 && (
                        <button
                          onClick={() => toggleExpand(report.id)}
                          className="text-blue-600 dark:text-blue-400 text-xs font-medium mt-1 hover:underline"
                        >
                          {expandedReports[report.id]
                            ? 'Lihat lebih sedikit'
                            : 'Lihat selengkapnya'}
                        </button>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          color="blue"
                          className="inline-flex items-center max-w-full"
                        >
                          <div className="flex items-center gap-1 truncate">
                            <HiOutlineTag className="h-3 w-3 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                              Kategori:
                            </span>
                            <span className="truncate">
                              {report.category || 'LAINNYA'}
                            </span>
                          </div>
                        </Badge>

                        <Badge
                          color="purple"
                          className="inline-flex items-center max-w-full"
                        >
                          <div className="flex items-center gap-1 truncate">
                            <HiOutlineTag className="h-3 w-3 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                              Subkategori:
                            </span>
                            <span className="truncate">
                              {report.subcategory || 'LAINNYA'}
                            </span>
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
