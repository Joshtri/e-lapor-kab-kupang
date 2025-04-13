'use client';

import { useEffect, useState } from 'react';
import { Card, Badge, Spinner, Button, Select } from 'flowbite-react';
import {
  HiExclamationCircle,
  HiChatAlt2,
  HiEye,
  HiFilter,
  HiOutlineExclamation,
  HiOutlineTicket,
  HiOutlineLightningBolt,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineX,
} from 'react-icons/hi';
import axios from 'axios';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import BugCommentModal from '@/components/pelapor/bug-reports/BugCommentModal';
import Pagination from '@/components/ui/Pagination';

export default function LaporBugPage() {
  const [bugReports, setBugReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBugReportId, setSelectedBugReportId] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedCommentBugId, setSelectedCommentBugId] = useState(null);

  // State untuk filter dan pagination
  const [filters, setFilters] = useState({
    priority: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 5,
    totalItems: 0,
  });

  const fetchBugReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.perPage,
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.month && { month: filters.month }),
        ...(filters.year && { year: filters.year }),
      });

      const res = await axios.get(
        `/api/pelapor/bug-reports?${params.toString()}`,
      );

      if (res.data && res.data.data) {
        setBugReports(res.data.data);
        setPagination({
          ...pagination,
          totalPages: res.data.totalPages,
          totalItems: res.data.totalItems,
        });
      } else {
        console.error('Unexpected API response structure:', res.data);
        setBugReports([]);
      }
    } catch (error) {
      console.error('Gagal mengambil laporan bug:', error);
      setBugReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugReports();
  }, [filters, pagination.currentPage]);

  // Status ticket configuration with icons
  const statusConfig = {
    OPEN: {
      color: 'gray',
      label: 'Tiket Dibuka',
      icon: <HiOutlineTicket className="w-4 h-4 mr-1" />,
    },
    IN_PROGRESS: {
      color: 'yellow',
      label: 'Tiket Diproses',
      icon: <HiOutlineClock className="w-4 h-4 mr-1" />,
    },
    RESOLVED: {
      color: 'green',
      label: 'Tiket Selesai',
      icon: <HiOutlineCheckCircle className="w-4 h-4 mr-1" />,
    },
    CLOSED: {
      color: 'red',
      label: 'Tiket Ditutup',
      icon: <HiOutlineX className="w-4 h-4 mr-1" />,
    },
  };

  // Priority configuration with icons
  const priorityConfig = {
    LOW: {
      color: 'blue',
      label: 'Prioritas Rendah',
      icon: <HiOutlineClock className="w-4 h-4 mr-1" />,
    },
    MEDIUM: {
      color: 'yellow',
      label: 'Prioritas Sedang',
      icon: <HiExclamationCircle className="w-4 h-4 mr-1" />,
    },
    HIGH: {
      color: 'red',
      label: 'Prioritas Tinggi',
      icon: <HiOutlineLightningBolt className="w-4 h-4 mr-1" />,
    },
  };

  const priorityOptions = [
    { value: '', label: 'Semua Prioritas' },
    { value: 'LOW', label: 'Rendah' },
    { value: 'MEDIUM', label: 'Sedang' },
    { value: 'HIGH', label: 'Tinggi' },
  ];

  const monthOptions = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const yearOptions = [
    {
      value: new Date().getFullYear(),
      label: new Date().getFullYear().toString(),
    },
    {
      value: new Date().getFullYear() - 1,
      label: (new Date().getFullYear() - 1).toString(),
    },
  ];

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  // Function to safely get a short ID
  const getShortId = (id) => {
    if (typeof id === 'string' && id.length > 0) {
      return id.slice(0, 8);
    }
    return id;
  };

  if (loading && bugReports.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 mt-10">
      {/* Header with bug theme */}
      <div className="bg-gradient-to-r from-red-500 to-purple-600 rounded-lg p-6 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-full">
            <HiOutlineExclamation className="text-red-500 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bug Tracker</h1>
            <p className="text-white/80">
              Laporkan dan pantau status bug yang Anda temukan
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
            <HiFilter className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter Laporan:
            </span>
          </div>

          <Select
            className="min-w-[180px]"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            className="min-w-[180px]"
            value={filters.month}
            onChange={(e) =>
              handleFilterChange('month', Number.parseInt(e.target.value))
            }
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            className="min-w-[120px]"
            value={filters.year}
            onChange={(e) =>
              handleFilterChange('year', Number.parseInt(e.target.value))
            }
          >
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {/* Shortcut Tambah Bug */}
      <div className="flex justify-start">
        <Button href="/pelapor/lapor-bug/create" color="red" className="mt-4">
          + Tambah Laporan Bug
        </Button>
      </div>

      {bugReports.length === 0 ? (
        <Card className="text-center py-8 border-dashed border-2 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <HiOutlineExclamation className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada laporan bug yang ditemukan dengan filter yang dipilih.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Coba ubah filter atau periksa kembali nanti
          </p>
        </Card>
      ) : (
        <>
          {bugReports.map((report) => (
            <Card
              key={report.id}
              className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="border-l-4 border-l-red-500 pl-4">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <HiOutlineExclamation className="text-red-500 w-5 h-5" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 border-l-2 border-gray-200 pl-3">
                      {report.description}
                    </p>

                    <div className="mt-4 flex gap-3 flex-wrap">
                      <Badge
                        color={
                          priorityConfig[report.priorityProblem]?.color ||
                          'gray'
                        }
                        className="flex items-center px-3 py-1.5"
                      >
                        {priorityConfig[report.priorityProblem]?.icon}
                        {priorityConfig[report.priorityProblem]?.label ||
                          report.priorityProblem}
                      </Badge>

                      <Badge
                        color={
                          statusConfig[report.statusProblem]?.color || 'gray'
                        }
                        className="flex items-center px-3 py-1.5"
                      >
                        {statusConfig[report.statusProblem]?.icon}
                        {statusConfig[report.statusProblem]?.label ||
                          report.statusProblem}
                      </Badge>
                    </div>

                    <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                        ID: #{getShortId(report.id)}
                      </span>
                      <span>
                        Dikirim pada:{' '}
                        {new Date(report.createdAt).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end justify-end">
                    {report.hasAttachment && (
                      <Button
                        size="sm"
                        color="blue"
                        pill
                        onClick={() => {
                          setSelectedBugReportId(report.id);
                          setIsImageModalOpen(true);
                        }}
                        className="flex items-center"
                      >
                        <HiEye className="w-4 h-4 mr-1" />
                        Lihat Screenshot
                      </Button>
                    )}

                    <Button
                      size="sm"
                      color="purple"
                      pill
                      onClick={() => {
                        setSelectedCommentBugId(report.id);
                        setIsCommentModalOpen(true);
                      }}
                      className="relative flex items-center"
                    >
                      <HiChatAlt2 className="w-4 h-4 mr-1" />
                      Komentar
                      {report._count?.bugComments > 0 && (
                        <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-white text-purple-600 px-1.5 py-0.5 rounded-full border border-purple-600 dark:bg-gray-800 dark:text-purple-400 dark:border-purple-400">
                          {report._count.bugComments}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <ImagePreviewModal
        open={isImageModalOpen}
        setOpen={setIsImageModalOpen}
        reportId={selectedBugReportId}
        type="bug"
      />

      <BugCommentModal
        open={isCommentModalOpen}
        setOpen={setIsCommentModalOpen}
        bugReportId={selectedCommentBugId}
      />
    </div>
  );
}
