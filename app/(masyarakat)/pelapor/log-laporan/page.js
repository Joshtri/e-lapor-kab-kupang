'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Badge, Card, Spinner, Button, Avatar, Timeline } from 'flowbite-react';
import { motion } from 'framer-motion';
import {
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiMailOpen,
  HiSearch,
  HiChevronLeft,
  HiFilter,
  HiOutlinePhotograph,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineRefresh,
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineTag,
  HiOutlineOfficeBuilding,
  HiOutlinePaperClip,
} from 'react-icons/hi';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';

export default function LogLaporanPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const resUser = await axios.get('/api/auth/me');
        const userId = resUser.data.user.id;

        const res = await axios.get(`/api/reports?userId=${userId}`);
        setReports(res.data);
      } catch (error) {
        console.error('Gagal mengambil laporan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return 'gray';

    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai') return 'success';
    if (statusLower === 'proses') return 'warning';
    if (statusLower === 'ditolak') return 'failure';
    if (statusLower === 'pending') return 'info';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center"
        >
          <Spinner size="xl" color="info" />
          <span className="mt-4 font-medium text-gray-700">
            Memuat riwayat laporan...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <Card className="mb-6 border-t-4 border-blue-600 shadow-lg">
          <div className="flex items-center">
            <Link href="/pelapor/dashboard" className="mr-4">
              <Button color="light" size="sm" className="rounded-full">
                <HiChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center">
                <HiMailOpen className="mr-2 h-6 w-6 text-blue-600" />
                Kotak Masuk Laporan
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Lihat status dan riwayat laporan yang telah Anda kirim
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiSearch className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiFilter className="w-5 h-5 text-gray-500" />
              </div>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
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

        {filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center py-12">
              <div className="flex flex-col items-center">
                <div className="bg-blue-50 p-6 rounded-full mb-4">
                  <HiOutlineMail className="h-16 w-16 text-blue-500" />
                </div>
                <p className="text-gray-600 text-lg font-medium">
                  {searchQuery || filter !== 'ALL'
                    ? 'Tidak ada laporan yang cocok dengan kriteria pencarian.'
                    : 'Anda belum memiliki laporan.'}
                </p>
                <Link href="/pelapor/dashboard" className="mt-6">
                  <Button gradientDuoTone="cyanToBlue" size="lg">
                    <HiOutlineMail className="mr-2 h-5 w-5" />
                    Buat Laporan Baru
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report, index) => {
              const latestComment = report.comments?.find(
                (comment) => comment.user.role === 'BUPATI',
              );
              const isSelected = selectedReport === report.id;

              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`overflow-hidden transition-all duration-200 hover:shadow-md ${isSelected ? 'border-blue-300 shadow-md' : 'border-gray-200'}`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => handleReportClick(report)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full bg-${getStatusColor(report.bupatiStatus)}-100 text-${getStatusColor(report.bupatiStatus)}-500 flex-shrink-0`}
                          >
                            {getStatusIcon(report.bupatiStatus)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {report.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge
                                color={getStatusColor(report.bupatiStatus)}
                                size="sm"
                              >
                                {report.bupatiStatus}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center">
                                <HiOutlineCalendar className="mr-1 h-3 w-3" />
                                {new Date(report.createdAt).toLocaleDateString(
                                  'id-ID',
                                  {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  },
                                )}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center">
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
                                report.priority.toLowerCase() === 'tinggi'
                                  ? 'failure'
                                  : report.priority.toLowerCase() === 'sedang'
                                    ? 'warning'
                                    : 'info'
                              }
                              size="sm"
                            >
                              Prioritas: {report.priority}
                            </Badge>
                          )}
                          <Button
                            size="xs"
                            color="light"
                            pill
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

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pt-2"
                      >
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-700 whitespace-pre-line">
                                {report.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-start gap-2">
                                <HiOutlineLocationMarker className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Lokasi
                                  </p>
                                  <p className="text-sm font-medium">
                                    {report.location || '-'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    OPD Tujuan
                                  </p>
                                  <p className="text-sm font-medium">
                                    {report.opd?.name || '-'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <HiOutlineTag className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Kategori
                                  </p>
                                  <p className="text-sm font-medium">
                                    {report.category || '-'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <HiOutlineTag className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Subkategori
                                  </p>
                                  <p className="text-sm font-medium">
                                    {report.subcategory || '-'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="xs"
                                color="light"
                                onClick={() => {
                                  setSelectedReportId(report.id);
                                  setModalOpen(true);
                                }}
                              >
                                <HiOutlinePaperClip className="mr-1 h-4 w-4" />{' '}
                                Lihat Lampiran
                              </Button>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 flex items-center mb-3">
                              <HiOutlineChatAlt2 className="mr-2 h-5 w-5" />
                              Tanggapan
                            </h4>

                            {latestComment ? (
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <Avatar rounded size="sm" />
                                  <div className="bg-white p-3 rounded-lg shadow-sm w-full">
                                    <div className="flex justify-between items-start mb-1">
                                      <p className="text-sm font-medium">
                                        Bupati
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          latestComment.createdAt,
                                        ).toLocaleDateString('id-ID', {
                                          day: 'numeric',
                                          month: 'short',
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm">
                                      {latestComment.comment}
                                    </p>
                                  </div>
                                </div>

                                <Timeline>
                                  <Timeline.Item>
                                    <Timeline.Point />
                                    <Timeline.Content>
                                      <Timeline.Time>
                                        {new Date(
                                          report.createdAt,
                                        ).toLocaleDateString('id-ID', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                        })}
                                      </Timeline.Time>
                                      <Timeline.Title>
                                        Laporan Dibuat
                                      </Timeline.Title>
                                    </Timeline.Content>
                                  </Timeline.Item>

                                  {report.bupatiStatus === 'PROSES' && (
                                    <Timeline.Item>
                                      <Timeline.Point />
                                      <Timeline.Content>
                                        <Timeline.Title>
                                          Sedang Diproses
                                        </Timeline.Title>
                                      </Timeline.Content>
                                    </Timeline.Item>
                                  )}

                                  {report.bupatiStatus === 'SELESAI' && (
                                    <Timeline.Item>
                                      <Timeline.Point />
                                      <Timeline.Content>
                                        <Timeline.Title>
                                          Laporan Selesai
                                        </Timeline.Title>
                                      </Timeline.Content>
                                    </Timeline.Item>
                                  )}
                                </Timeline>
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <HiOutlineChatAlt2 className="h-10 w-10 text-blue-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
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
