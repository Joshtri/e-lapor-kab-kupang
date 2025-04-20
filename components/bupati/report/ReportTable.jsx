'use client';

import { useState } from 'react';
import { Table, Badge, Button, Tooltip } from 'flowbite-react';
import {
  HiOutlineEye,
  HiOutlineChatAlt2,
  HiOutlinePencilAlt,
  HiOutlineClock,
  HiCheckCircle,
} from 'react-icons/hi';
import ReportView from '@/components/bupati/report/ReportDetail';
import UpdateStatusModal from '@/components/bupati/UpdateStatusPelapor';
import CommentModal from '@/components/bupati/comment/comment-modal';
import { useRouter } from 'next/navigation';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import ReportStatusModal from '@/components/common/ReportStatusModal';

export default function ReportTable({ reports }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageReportId, setSelectedImageReportId] = useState(null);
  const router = useRouter();

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const markAsRead = async (report) => {
    try {
      if (!report.isReadByBupati) {
        setLoadingId(report.id);
        await fetch(`/api/reports/${report.id}/mark-read-bupati`, {
          method: 'PATCH',
        });
      }
      router.push(`/bupati-portal/laporan-warga/${report.id}`);
    } catch (err) {
      'Gagal update status terbaca:', err;
    } finally {
      setLoadingId(null);
    }
  };

  // Function to truncate text with a character limit
  const truncateText = (text, limit = 50) => {
    if (!text) return '-';
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  const openImageModal = (reportId) => {
    setSelectedImageReportId(reportId);
    setIsImageModalOpen(true);
  };
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
      <Table
        hoverable
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
      >
        <Table.Head className="bg-gray-50 dark:bg-gray-800">
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Nama Pelapor
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Subjek
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Kategori
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Deskripsi
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Status
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            OPD Terkait
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tanggal
          </Table.HeadCell>
          <Table.HeadCell className="w-[100px]">Lampiran</Table.HeadCell>

          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Aksi
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {reports.map((report) => (
            <Table.Row
              key={report.id}
              className={`transition-colors duration-150 ${
                !report.isReadByBupati
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {report.user?.name || 'Anonim'}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[180px]">
                    {truncateText(report.title, 40)}
                  </span>
                  {!report.isReadByBupati ? (
                    <Tooltip
                      content="Belum Dibaca oleh Bupati"
                      placement="right"
                    >
                      <HiOutlineClock className="text-yellow-500 w-4 h-4 flex-shrink-0" />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      content="Sudah Dibaca oleh Bupati"
                      placement="right"
                    >
                      <HiCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                    </Tooltip>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <Tooltip
                  content={report.category || 'Tidak ada kategori'}
                  style="light"
                  animation="duration-300"
                >
                  <div className="max-w-[150px] cursor-help">
                    {truncateText(report.category, 20)}
                  </div>
                </Tooltip>
              </Table.Cell>

              <Table.Cell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                <Tooltip
                  content={report.description || 'Tidak ada deskripsi'}
                  style="light"
                  animation="duration-300"
                >
                  <div className="max-w-[150px] cursor-help">
                    {truncateText(report.description, 40)}
                  </div>
                </Tooltip>
              </Table.Cell>

              <Table.Cell className="px-4 py-3 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <Badge
                    color={
                      report.bupatiStatus === 'SELESAI'
                        ? 'green'
                        : report.bupatiStatus === 'PROSES'
                          ? 'yellow'
                          : report.bupatiStatus === 'DITOLAK'
                            ? 'red'
                            : 'gray'
                    }
                    className="w-fit text-xs"
                  >
                    Bupati: {report.bupatiStatus}
                  </Badge>
                  <Badge
                    color={
                      report.opdStatus === 'SELESAI'
                        ? 'green'
                        : report.opdStatus === 'PROSES'
                          ? 'yellow'
                          : report.opdStatus === 'DITOLAK'
                            ? 'red'
                            : 'gray'
                    }
                    className="w-fit text-xs"
                  >
                    OPD: {report.opdStatus}
                  </Badge>
                </div>
              </Table.Cell>

              <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {report.opd?.name || '-'}
              </Table.Cell>

              <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {new Date(report.createdAt).toLocaleDateString('id-ID')}
              </Table.Cell>

              {/* 📷 Gambar lampiran */}
              <Table.Cell className="text-center">
                <Tooltip content="Lihat Gambar">
                  <Button
                    size="xs"
                    color="gray"
                    className="p-2"
                    onClick={() => openImageModal(report.id)}
                  >
                    🖼️
                  </Button>
                </Tooltip>
              </Table.Cell>

              <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-1">
                  <Tooltip content="Lihat Detail" placement="top">
                    <Button
                      color="gray"
                      size="xs"
                      disabled={loadingId === report.id}
                      onClick={() => markAsRead(report)}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Komentar" placement="top">
                    <Button
                      color="purple"
                      size="xs"
                      onClick={() => {
                        setSelectedReport(report);
                        setOpenCommentModal(true);
                      }}
                      className="p-1.5 hover:bg-purple-600"
                    >
                      <HiOutlineChatAlt2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Ubah Status" placement="top">
                    <Button
                      color="blue"
                      size="xs"
                      onClick={() => {
                        setSelectedReport(report);
                        setOpenStatusModal(true);
                      }}
                      className="p-1.5 hover:bg-blue-600"
                    >
                      <HiOutlinePencilAlt className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Modal Detail Laporan */}
      {selectedReport && (
        <ReportView
          report={selectedReport}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Modal Ubah Status */}
      {selectedReport && (
        <ReportStatusModal
          open={openStatusModal}
          setOpen={setOpenStatusModal}
          report={selectedReport}
        />
      )}

      {/* Modal Komentar */}
      {selectedReport && (
        <CommentModal
          open={openCommentModal}
          setOpen={setOpenCommentModal}
          reportId={selectedReport.id}
        />
      )}

      {selectedImageReportId && (
        <ImagePreviewModal
          open={isImageModalOpen}
          setOpen={setIsImageModalOpen}
          reportId={selectedImageReportId}
        />
      )}
    </div>
  );
}
