'use client';

import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import Button from '@/components/ui/Button';
import { Avatar, Badge, Card, Timeline } from 'flowbite-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCurrentUser } from '@/services/authService';
import { useUserReports } from '@/services/reportService';
import {
  HiChevronLeft,
  HiFilter,
  HiMailOpen,
  HiOutlineCalendar,
  HiOutlineChatAlt2,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineExclamation,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlinePaperClip,
  HiOutlinePhotograph,
  HiOutlineRefresh,
  HiOutlineTag,
  HiOutlineX,
  HiSearch,
} from 'react-icons/hi';

export default function LogLaporanPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // TanStack Query hooks with caching
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useCurrentUser();
  const {
    data: reports = [],
    isLoading: reportsLoading,
    isError: reportsError,
  } = useUserReports(user?.id);

  // Combined loading state
  const loading = userLoading || reportsLoading;

  const getStatusColor = (status) => {
    if (!status) return 'gray';

    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai') return 'green';
    if (statusLower === 'proses') return 'yellow';
    if (statusLower === 'ditolak') return 'red';
    if (statusLower === 'pending') return 'blue';
    return 'gray';
  };

  const getStatusIcon = (status) => {
    if (!status) return <HiOutlineExclamation className="h-5 w-5" />;

    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai')
      return <HiOutlineCheckCircle className="h-5 w-5" />;
    if (statusLower === 'proses')
      return <HiOutlineRefresh className="h-5 w-5" />;
    if (statusLower === 'ditolak') return <HiOutlineX className="h-5 w-5" />;
    if (statusLower === 'pending')
      return <HiOutlineClipboardList className="h-5 w-5" />;
    return <HiOutlineExclamation className="h-5 w-5" />;
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || report.bupatiStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const handleReportClick = (report) => {
    setSelectedReport(report.id === selectedReport ? null : report.id);
  };

  const currentMonthKey = new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  const [expandedMonth, setExpandedMonth] = useState(currentMonthKey);

  const toggleMonth = (month) => {
    setExpandedMonth((prev) => (prev === month ? null : month));
  };

  const groupReportsByMonth = (reports) => {
    const grouped = {};

    reports.forEach((report) => {
      const date = new Date(report.createdAt);
      const monthKey = date.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }

      grouped[monthKey].push(report);
    });

    return grouped;
  };

  const groupedReports = groupReportsByMonth(filteredReports);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <LoadingScreen message="Memuat riwayat pengaduan..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Card with Gradient Border */}
        <Card className="mb-6 border-t-4 border-blue-600 dark:border-blue-500 shadow-lg dark:bg-gray-800 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center">
            <Button
              as="link"
              href="/pelapor/dashboard"
              isIconOnly
              variant="light"
              size="sm"
              rounded="full"
              className="mr-4"
            >
              <HiChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <Heading className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <HiMailOpen className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Kotak Masuk Pengaduan
              </Heading>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Lihat status dan riwayat pengaduan yang telah Anda kirim
              </Text>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
                placeholder="Cari pengaduan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiFilter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROSES">Proses</option>
                <option value="SELESAI">Selesai</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Empty State */}
        {filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center py-12 dark:bg-gray-800 bg-white">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-4 transition-colors">
                  <HiOutlineMail className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  {searchQuery || filter !== 'ALL'
                    ? 'Tidak ada pengaduan yang cocok dengan kriteria pencarian.'
                    : 'Anda belum memiliki pengaduan.'}
                </p>
                <Button
                  as="link"
                  href="/pelapor/dashboard"
                  variant="solid"
                  color="primary"
                  size="lg"
                  startIcon={<HiOutlineMail className="h-5 w-5" />}
                  className="mt-6"
                >
                  Buat Pengaduan Baru
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedReports).map(([month, reports]) => {
              const isOpen = expandedMonth === month;

              return (
                <div
                  key={month}
                  className="border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm transition-colors"
                >
                  {/* Month Header */}
                  <button
                    onClick={() => toggleMonth(month)}
                    className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-between rounded-t-md"
                  >
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {month}{' '}
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                        {reports.length} pengaduan
                      </span>
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {isOpen ? 'Sembunyikan' : 'Tampilkan'}
                    </span>
                  </button>

                  {/* Reports List */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-2 py-2">
                      {reports.map((report, index) => {
                        const latestComment = report.comments?.find(
                          (comment) => comment.user.role === 'BUPATI',
                        );
                        const isSelected = selectedReport === report.id;
                        const statusColor = getStatusColor(report.bupatiStatus);

                        return (
                          <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card
                              className={`overflow-hidden transition-all duration-200 mb-4 border 
                                ${
                                  isSelected
                                    ? 'border-blue-300 dark:border-blue-500 shadow-md'
                                    : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                                }
                                bg-white dark:bg-gray-800`}
                            >
                              <div
                                className="cursor-pointer"
                                onClick={() => handleReportClick(report)}
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-3 dark:border-gray-700">
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`p-2 rounded-full bg-${statusColor}-100 dark:bg-${statusColor}-500 text-${statusColor}-600 dark:text-${statusColor}-300 flex-shrink-0 transition-colors`}
                                    >
                                      {getStatusIcon(report.bupatiStatus)}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                                        {report.title}
                                      </h3>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        <Badge
                                          color={statusColor}
                                          size="sm"
                                          className="dark:bg-opacity-70"
                                        >
                                          <span className="font-medium">
                                            Bupati:
                                          </span>{' '}
                                          {report.bupatiStatus}
                                        </Badge>
                                        <Badge
                                          color={getStatusColor(
                                            report.opdStatus,
                                          )}
                                          size="sm"
                                          className="dark:bg-opacity-70"
                                        >
                                          <span className="font-medium">
                                            OPD:
                                          </span>{' '}
                                          {report.opdStatus || 'Belum ada'}
                                        </Badge>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                          <HiOutlineCalendar className="mr-1 h-3 w-3" />
                                          {new Date(
                                            report.createdAt,
                                          ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                          })}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                          <HiOutlineTag className="mr-1 h-3 w-3" />
                                          {report.category}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {report.priority && (
                                      <Badge
                                        color={
                                          report.priority.toLowerCase() ===
                                          'tinggi'
                                            ? 'red'
                                            : report.priority.toLowerCase() ===
                                                'sedang'
                                              ? 'yellow'
                                              : 'blue'
                                        }
                                        size="sm"
                                        className="dark:bg-opacity-70"
                                      >
                                        Prioritas: {report.priority}
                                      </Badge>
                                    )}
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      size="xs"
                                      rounded="full"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedReportId(report.id);
                                        setModalOpen(true);
                                      }}
                                    >
                                      <HiOutlinePhotograph className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Report Details */}
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 pt-2"
                                >
                                  <div className="grid md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2 space-y-3">
                                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                          {report.description}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-start gap-2">
                                          <HiOutlineLocationMarker className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              Lokasi
                                            </p>
                                            <p className="text-sm font-medium dark:text-white">
                                              {report.location || '-'}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                          <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              OPD Tujuan
                                            </p>
                                            <p className="text-sm font-medium dark:text-white">
                                              {report.opd?.name || '-'}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                          <HiOutlineTag className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              Kategori
                                            </p>
                                            <p className="text-sm font-medium dark:text-white">
                                              {report.category || '-'}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                          <HiOutlineTag className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              Subkategori
                                            </p>
                                            <p className="text-sm font-medium dark:text-white">
                                              {report.subcategory || '-'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="light"
                                          size="xs"
                                          startIcon={
                                            <HiOutlinePaperClip className="h-4 w-4" />
                                          }
                                          onClick={() => {
                                            setSelectedReportId(report.id);
                                            setModalOpen(true);
                                          }}
                                        >
                                          Lihat Lampiran
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-colors">
                                      <h4 className="font-medium text-blue-800 dark:text-blue-300 flex items-center mb-3">
                                        <HiOutlineChatAlt2 className="mr-2 h-5 w-5" />
                                        Tanggapan
                                      </h4>

                                      {latestComment ? (
                                        <div className="space-y-3">
                                          <div className="flex items-start gap-3">
                                            <Avatar rounded size="sm" />
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm w-full">
                                              <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-medium dark:text-white">
                                                  Bupati
                                                </p>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                  {new Date(
                                                    latestComment.createdAt,
                                                  ).toLocaleDateString(
                                                    'id-ID',
                                                    {
                                                      day: 'numeric',
                                                      month: 'short',
                                                    },
                                                  )}
                                                </span>
                                              </div>
                                              <p className="text-sm dark:text-gray-300">
                                                {latestComment.comment}
                                              </p>
                                            </div>
                                          </div>

                                          <Timeline>
                                            <Timeline.Item>
                                              <Timeline.Point className="dark:bg-blue-500" />
                                              <Timeline.Content>
                                                <Timeline.Time className="text-gray-500 dark:text-gray-400">
                                                  {new Date(
                                                    report.createdAt,
                                                  ).toLocaleDateString(
                                                    'id-ID',
                                                    {
                                                      day: 'numeric',
                                                      month: 'long',
                                                      year: 'numeric',
                                                    },
                                                  )}
                                                </Timeline.Time>
                                                <Timeline.Title className="dark:text-white">
                                                  Pengaduan Dibuat
                                                </Timeline.Title>
                                              </Timeline.Content>
                                            </Timeline.Item>

                                            {report.bupatiStatus ===
                                              'PROSES' && (
                                              <Timeline.Item>
                                                <Timeline.Point className="dark:bg-yellow-500" />
                                                <Timeline.Content>
                                                  <Timeline.Title className="dark:text-white">
                                                    Sedang Diproses oleh Bupati
                                                  </Timeline.Title>
                                                </Timeline.Content>
                                              </Timeline.Item>
                                            )}

                                            {report.bupatiStatus ===
                                              'SELESAI' && (
                                              <Timeline.Item>
                                                <Timeline.Point className="dark:bg-green-500" />
                                                <Timeline.Content>
                                                  <Timeline.Title className="dark:text-white">
                                                    Pengaduan Selesai oleh Bupati
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
                                                    Pengaduan Selesai oleh OPD
                                                  </Timeline.Title>
                                                </Timeline.Content>
                                              </Timeline.Item>
                                            )}
                                          </Timeline>
                                        </div>
                                      ) : (
                                        <div className="text-center py-6">
                                          <HiOutlineChatAlt2 className="h-10 w-10 text-blue-300 dark:text-blue-500/50 mx-auto mb-2" />
                                          <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Belum ada tanggapan dari Bupati.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
        <ImagePreviewModal
          open={modalOpen}
          setOpen={setModalOpen}
          reportId={selectedReportId}
        />
      </motion.div>
    </div>
  );
}
