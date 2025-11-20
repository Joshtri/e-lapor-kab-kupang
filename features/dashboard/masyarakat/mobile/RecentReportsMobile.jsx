'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Badge, Spinner, Button } from 'flowbite-react';
import {
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiXCircle,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import SkeletonCardLoading from '@/components/ui/loading/SkeletonCardLoading';

const RecentReportsMobile = ({ user, triggerRefetch, onViewAll }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          `/api/reports?userId=${user.id}&limit=3&sort=desc`,
        );
        setReports(res.data.reports || []);
      } catch (error) {
        console.error('Gagal mengambil laporan terbaru', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReports();
    }
  }, [user, triggerRefetch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <HiClock className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <HiExclamationCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <HiCheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <HiXCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'failure';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'in-progress':
        return 'Diproses';
      case 'completed':
        return 'Selesai';
      default:
        return 'Ditolak';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <SkeletonCardLoading />;
  }

  return (
    <Card className="mt-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Pengaduan Terbaru
          </h3>
          <Button
            size="sm"
            color="light"
            onClick={onViewAll}
            className="text-blue-600 dark:text-blue-400"
          >
            Lihat Semua
          </Button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada pengaduan
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {getStatusIcon(report.status)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {report.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(report.createdAt)}
                  </p>
                </div>
                <Badge color={getStatusBadgeColor(report.status)} size="sm">
                  {getStatusText(report.status)}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentReportsMobile;
