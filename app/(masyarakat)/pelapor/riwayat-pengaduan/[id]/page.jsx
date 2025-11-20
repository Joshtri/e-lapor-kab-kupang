'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button, Badge, Card, Avatar, Timeline } from 'flowbite-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useState } from 'react';
import {
  HiChevronLeft,
  HiOutlineLocationMarker,
  HiOutlineTag,
  HiOutlineOfficeBuilding,
  HiOutlineChatAlt2,
  HiOutlineCalendar,
  HiOutlinePaperClip,
  HiOutlinePhotograph,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import { fetchReportDetail } from '@/services/reportService';

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id;
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: report,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reportDetail', reportId],
    queryFn: () => fetchReportDetail(reportId),
    enabled: !!reportId,
    onError: () => {
      toast.error('Gagal mengambil detail laporan.');
    },
  });

  const getStatusIcon = (status) => {
    if (!status) return <HiOutlineExclamation className="h-5 w-5" />;

    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai')
      return <HiOutlineCheckCircle className="h-5 w-5" />;
    if (statusLower === 'proses') return <HiOutlineRefresh className="h-5 w-5" />;
    if (statusLower === 'ditolak') return <HiOutlineX className="h-5 w-5" />;
    if (statusLower === 'pending')
      return <HiOutlineClipboardList className="h-5 w-5" />;
    return <HiOutlineExclamation className="h-5 w-5" />;
  };

  const getStatusColor = (status) => {
    if (!status) return 'gray';

    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai') return 'green';
    if (statusLower === 'proses') return 'yellow';
    if (statusLower === 'ditolak') return 'red';
    if (statusLower === 'pending') return 'blue';
    return 'gray';
  };

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen py-8 px-4 md:px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <Button
            color="light"
            size="md"
            onClick={() => router.back()}
            className="mb-6 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <HiChevronLeft className="mr-2 h-5 w-5" />
            Kembali
          </Button>

          <Card className="text-center py-12 dark:bg-gray-800 bg-white">
            <div className="flex flex-col items-center">
              <HiOutlineExclamation className="h-16 w-16 text-red-600 dark:text-red-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                {error?.message || 'Laporan tidak ditemukan.'}
              </p>
              <Button
                onClick={() => router.back()}
                className="mt-6"
                color="blue"
              >
                Kembali ke Daftar Laporan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const latestComment = report.comments?.find(
    (comment) => comment.user.role === 'BUPATI'
  );
  const statusColor = getStatusColor(report.bupatiStatus);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-8 px-4 md:px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button
            color="light"
            size="md"
            onClick={() => router.back()}
            className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <HiChevronLeft className="mr-2 h-5 w-5" />
            Kembali
          </Button>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="mb-6 border-t-4 border-blue-600 dark:border-blue-500 shadow-lg dark:bg-gray-800 bg-white">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full bg-${statusColor}-100 dark:bg-${statusColor}-500 text-${statusColor}-600 dark:text-${statusColor}-300 flex-shrink-0`}
              >
                {getStatusIcon(report.bupatiStatus)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {report.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {report.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    color={statusColor}
                    size="lg"
                    className="dark:bg-opacity-70"
                  >
                    <span className="font-medium">Bupati:</span> {report.bupatiStatus}
                  </Badge>
                  <Badge
                    color={getStatusColor(report.opdStatus)}
                    size="lg"
                    className="dark:bg-opacity-70"
                  >
                    <span className="font-medium">OPD:</span>{' '}
                    {report.opdStatus || 'Belum ada'}
                  </Badge>
                  {report.priority && (
                    <Badge
                      color={
                        report.priority.toLowerCase() === 'tinggi'
                          ? 'red'
                          : report.priority.toLowerCase() === 'sedang'
                            ? 'yellow'
                            : 'blue'
                      }
                      size="lg"
                      className="dark:bg-opacity-70"
                    >
                      Prioritas: {report.priority}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Details Card */}
            <Card className="mb-6 dark:bg-gray-800 bg-white">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Informasi Laporan
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <HiOutlineCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Tanggal Dibuat
                    </p>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {format(new Date(report.createdAt), 'dd MMMM yyyy HH:mm', {
                        locale: idLocale,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HiOutlineCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Terakhir Diupdate
                    </p>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {format(
                        new Date(report.updatedAt || report.createdAt),
                        'dd MMMM yyyy HH:mm',
                        { locale: idLocale }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HiOutlineLocationMarker className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Lokasi
                    </p>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {report.location || '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      OPD Tujuan
                    </p>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {report.opd?.name || '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HiOutlineTag className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Kategori
                    </p>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {report.category || '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HiOutlineTag className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Subkategori
                    </p>
                    <p className="text-sm font-medium dark:text-white mt-1">
                      {report.subcategory || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  color="light"
                  className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setModalOpen(true)}
                >
                  <HiOutlinePhotograph className="mr-2 h-4 w-4" />
                  Lihat Lampiran
                </Button>
              </div>
            </Card>

            {/* Timeline Card */}
            <Card className="dark:bg-gray-800 bg-white">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Timeline Pengaduan
              </h2>

              <Timeline>
                <Timeline.Item>
                  <Timeline.Point className="dark:bg-blue-500" />
                  <Timeline.Content>
                    <Timeline.Time className="text-gray-500 dark:text-gray-400">
                      {format(new Date(report.createdAt), 'dd MMMM yyyy HH:mm', {
                        locale: idLocale,
                      })}
                    </Timeline.Time>
                    <Timeline.Title className="dark:text-white">
                      Laporan Dibuat
                    </Timeline.Title>
                  </Timeline.Content>
                </Timeline.Item>

                {report.bupatiStatus === 'PROSES' && (
                  <Timeline.Item>
                    <Timeline.Point className="dark:bg-yellow-500" />
                    <Timeline.Content>
                      <Timeline.Title className="dark:text-white">
                        Sedang Diproses oleh Bupati
                      </Timeline.Title>
                    </Timeline.Content>
                  </Timeline.Item>
                )}

                {report.bupatiStatus === 'SELESAI' && (
                  <Timeline.Item>
                    <Timeline.Point className="dark:bg-green-500" />
                    <Timeline.Content>
                      <Timeline.Title className="dark:text-white">
                        Laporan Selesai oleh Bupati
                      </Timeline.Title>
                    </Timeline.Content>
                  </Timeline.Item>
                )}

                {report.bupatiStatus === 'DITOLAK' && (
                  <Timeline.Item>
                    <Timeline.Point className="dark:bg-red-500" />
                    <Timeline.Content>
                      <Timeline.Title className="dark:text-white">
                        Laporan Ditolak oleh Bupati
                      </Timeline.Title>
                    </Timeline.Content>
                  </Timeline.Item>
                )}

                {report.opdStatus === 'PROSES' && (
                  <Timeline.Item>
                    <Timeline.Point className="dark:bg-yellow-500" />
                    <Timeline.Content>
                      <Timeline.Title className="dark:text-white">
                        Sedang Diproses oleh OPD
                      </Timeline.Title>
                    </Timeline.Content>
                  </Timeline.Item>
                )}

                {report.opdStatus === 'SELESAI' && (
                  <Timeline.Item>
                    <Timeline.Point className="dark:bg-green-500" />
                    <Timeline.Content>
                      <Timeline.Title className="dark:text-white">
                        Laporan Selesai oleh OPD
                      </Timeline.Title>
                    </Timeline.Content>
                  </Timeline.Item>
                )}

                {report.completedAt && (
                  <Timeline.Item>
                    <Timeline.Point className="dark:bg-green-500" />
                    <Timeline.Content>
                      <Timeline.Time className="text-gray-500 dark:text-gray-400">
                        {format(
                          new Date(report.completedAt),
                          'dd MMMM yyyy HH:mm',
                          { locale: idLocale }
                        )}
                      </Timeline.Time>
                      <Timeline.Title className="dark:text-white">
                        Pengaduan Diselesaikan
                      </Timeline.Title>
                    </Timeline.Content>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {/* Comments Section */}
            <Card className="dark:bg-gray-800 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center mb-4 text-lg">
                <HiOutlineChatAlt2 className="mr-2 h-5 w-5" />
                Tanggapan
              </h3>

              {latestComment ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar rounded size="md" />
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium dark:text-white">
                          {latestComment.user?.name || 'Bupati'}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(
                            new Date(latestComment.createdAt),
                            'dd MMM yyyy',
                            { locale: idLocale }
                          )}
                        </span>
                      </div>
                      <p className="text-sm dark:text-gray-300 leading-relaxed">
                        {latestComment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <HiOutlineChatAlt2 className="h-10 w-10 text-blue-300 dark:text-blue-500/50 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Belum ada tanggapan dari Bupati.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        open={modalOpen}
        setOpen={setModalOpen}
        reportId={reportId}
      />
    </motion.div>
  );
}
