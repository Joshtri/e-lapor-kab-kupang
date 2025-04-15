'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  HiMailOpen,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

export default function ReportsSection() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/public/reports/latest');
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error('Gagal mengambil laporan terbaru', error);
      }
    };

    fetchReports();
  }, []);

  const currentMonthLabel = format(new Date(), 'MMMM yyyy', { locale: id });

  return (
    <div className="py-20 bg-white dark:bg-gray-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <HiMailOpen className="text-blue-600 h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-gray-200">
            Laporan Terbaru
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-200">
            Berikut adalah laporan yang diselesaikan pada bulan{' '}
            <strong>{currentMonthLabel}</strong> oleh Pemerintah Kabupaten
            Kupang.
          </p>
        </motion.div>

        {reports.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Belum ada laporan selesai bulan ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-500 h-3"></div>

                <div className="h-48 bg-gray-200 relative">
                  <Image
                    src="/placeholder.svg?height=600&width=400"
                    alt={report.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                    {report.bupatiStatus}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-md p-2 shadow-sm transform rotate-6">
                    <div className="text-xs font-medium text-gray-800 flex items-center">
                      <HiOutlineCalendar className="mr-1 h-3 w-3" />
                      {format(new Date(report.createdAt), 'dd MMM yyyy', {
                        locale: id,
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-5 dark:bg-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-3 py-1 flex items-center">
                      <HiOutlineTag className="mr-1 h-3 w-3" />
                      {report.category || 'LAINNYA'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 dark:text-gray-200">
                    {report.title}
                  </h3>
                  <p className="text-gray-600 mb-4 dark:text-gray-300">
                    Laporan ini telah ditindaklanjuti oleh OPD terkait dan telah
                    diselesaikan dengan baik.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
