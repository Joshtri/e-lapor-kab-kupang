'use client';

import { useState } from 'react';
import { Table, Badge, Button, Tooltip } from 'flowbite-react';
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineChatAlt2,
  HiOutlineExclamation,
  HiOutlineClock,
  HiCheckCircle,
} from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import UpdateStatusModalByAdmin from './ReportUpdateStatus';
import CommentModal from '../comment/CommentModal';
import InlineOPDSelector from './InlineOPDSelector';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';

// Status enum
const Status = {
  PENDING: 'PENDING',
  PROSES: 'PROSES',
  SELESAI: 'SELESAI',
  DITOLAK: 'DITOLAK',
};

// Komponen PriorityBadge yang menyesuaikan warna dan ikon dengan prioritas
const PriorityBadge = ({ priority }) => {
  let color = 'blue';
  let icon = null;

  switch (priority?.toUpperCase()) {
    case 'HIGH':
      color = 'red';
      icon = <HiOutlineExclamation className="mr-1" />;
      break;
    case 'MEDIUM':
      color = 'yellow';
      icon = <HiOutlineExclamation className="mr-1" />;
      break;
    case 'LOW':
      color = 'green';
      icon = <HiOutlineExclamation className="mr-1" />;
      break;
    default:
      color = 'gray';
      break;
  }

  return (
    <Badge color={color} className="flex items-center w-fit">
      {icon}
      {priority}
    </Badge>
  );
};

// Function to truncate text with a character limit
const truncateText = (text, limit = 50) => {
  if (!text) return '-';
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

export default function ReportTable({ reports, fetchReports }) {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageReportId, setSelectedImageReportId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const openStatusModal = (report) => {
    setSelectedReport(report);
    setIsStatusModalOpen(true);
  };

  const openCommentModal = (report) => {
    setSelectedReport(report);
    setIsCommentModalOpen(true);
  };

  const markAsRead = async (report) => {
    router.push(`/adm/report-warga/${report.id}`);
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
            Status
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            OPD Terkait
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Prioritas
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
                !report.isReadByAdmin
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
                  {!report.isReadByAdmin ? (
                    <Tooltip
                      content="Belum Dibaca oleh Admin"
                      placement="right"
                    >
                      <HiOutlineClock className="text-yellow-500 w-4 h-4 flex-shrink-0" />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      content="Sudah Dibaca oleh Admin"
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
                <InlineOPDSelector
                  report={report}
                  onUpdated={() => fetchReports()}
                />
              </Table.Cell>
              <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <PriorityBadge priority={report.priority} />
              </Table.Cell>
              <Table.Cell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {new Date(report.createdAt).toLocaleDateString('id-ID')}
              </Table.Cell>
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
                      onClick={() => openCommentModal(report)}
                      className="p-1.5 hover:bg-purple-600"
                    >
                      <HiOutlineChatAlt2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Ubah Status" placement="top">
                    <Button
                      color="blue"
                      size="xs"
                      onClick={() => openStatusModal(report)}
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

      {/* Modal Ubah Status */}
      {selectedReport && (
        <UpdateStatusModalByAdmin
          open={isStatusModalOpen}
          setOpen={setIsStatusModalOpen}
          report={selectedReport}
        />
      )}

      {/* Modal Komentar */}
      {selectedReport && (
        <CommentModal
          open={isCommentModalOpen}
          setOpen={setIsCommentModalOpen}
          reportId={selectedReport.id}
        />
      )}

      {selectedImageReportId && (
        <ImagePreviewModal
          open={isImageModalOpen}
          setOpen={setIsImageModalOpen}
          reportId={selectedImageReportId}
          type="report"
        />
      )}
    </div>
  );
}
