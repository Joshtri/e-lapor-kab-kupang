'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, Button } from 'flowbite-react';
import {
  HiArrowLeft,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineXCircle,
  HiOutlinePencilAlt,
  HiOutlineChatAlt2,
} from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import ReportStatusModal from '@/features/pengaduan/UpdatePengaduanStatusModal';
import CommentModal from '@/features/comments/create/CommentByBupatiModal';
import PengaduanComments from '@/features/pengaduan/comments/PengaduanComments';
import { fetchReportDetail } from '@/services/reportService';

const getStatusBadgeClass = (status) => {
  const baseClass =
    'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center';
  switch (status) {
    case 'PENDING':
      return `${baseClass} bg-yellow-100 text-yellow-700 border border-yellow-300`;
    case 'PROSES':
      return `${baseClass} bg-blue-100 text-blue-700 border border-blue-300`;
    case 'SELESAI':
      return `${baseClass} bg-green-100 text-green-700 border border-green-300`;
    case 'DITOLAK':
      return `${baseClass} bg-red-100 text-red-700 border border-red-300`;
    default:
      return `${baseClass} bg-gray-100 text-gray-700 border border-gray-300`;
  }
};

const getStatusIcon = (status) => {
  const iconClass = 'w-4 h-4 mr-1';
  switch (status) {
    case 'PENDING':
      return <HiOutlineClock className={iconClass} />;
    case 'PROSES':
      return <HiOutlineExclamation className={iconClass} />;
    case 'SELESAI':
      return <HiOutlineCheckCircle className={iconClass} />;
    case 'DITOLAK':
      return <HiOutlineXCircle className={iconClass} />;
    default:
      return null;
  }
};

export default function PengaduanDetailBupati() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const {
    data: report,
    isLoading: loading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['report', id],
    queryFn: () => fetchReportDetail(id),
    enabled: !!id,
    retry: 1,
  });

  if (loading) {
    return <LoadingScreen isLoading={loading} />;
  }

  if (isError || !report) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        <p className="text-lg font-semibold">Laporan tidak ditemukan.</p>
        <Button color="blue" className="mt-4" onClick={() => router.back()}>
          <HiArrowLeft className="mr-2 w-4 h-4" />
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <PageHeader
        backHref="/bupati-portal/kelola-pengaduan"
        title={`Detail Laporan: ${report.user?.name || 'Warga'}`}
        showBackButton={true}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/bupati-portal/dashboard' },
          customRoutes: {
            pengaduan: {
              label: 'Kelola Pengaduan',
              href: '/bupati-portal/kelola-pengaduan',
            },
          },
        }}
      />

      {/* Shortcut Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          color="purple"
          size="sm"
          onClick={() => setOpenCommentModal(true)}
        >
          <HiOutlineChatAlt2 className="w-4 h-4 mr-1" />
          Komentar
        </Button>
        <Button color="blue" size="sm" onClick={() => setOpenStatusModal(true)}>
          <HiOutlinePencilAlt className="w-4 h-4 mr-1" />
          Ubah Status
        </Button>
      </div>

      <Card className="p-6 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {report.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pelapor: {report.user?.name || 'N/A'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Kategori:
            </span>
            <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300">
              {report.category}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prioritas:
            </span>
            <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
              {report.priority}
            </span>
          </div>
          {/* Status Bupati */}
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status Bupati:
            </span>
            <span className={`ml-2 ${getStatusBadgeClass(report.bupatiStatus)}`}>
              {getStatusIcon(report.bupatiStatus)}
              {report.bupatiStatus}
            </span>
          </div>

          {/* Status OPD */}
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status OPD:
            </span>
            <span className={`ml-2 ${getStatusBadgeClass(report.opdStatus)}`}>
              {getStatusIcon(report.opdStatus)}
              {report.opdStatus}
            </span>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dibuat pada:
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-2">
              {new Date(report.createdAt).toLocaleString('id-ID')}
            </p>
          </div>

          {report.opd && (
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                OPD:
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                {report.opd.name}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Deskripsi:
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            {report.description}
          </p>
        </div>

        {report.attachments && report.attachments.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Lampiran:</h4>
            <div className="space-y-2">
              {report.attachments.map((attachment, idx) => (
                <img
                  key={idx}
                  src={attachment}
                  alt={`Lampiran ${idx + 1}`}
                  className="rounded-md max-w-sm"
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Comments Section */}
      <PengaduanComments reportId={report.id} />

      {/* Modal Ubah Status */}
      {openStatusModal && (
        <ReportStatusModal
          open={openStatusModal}
          setOpen={setOpenStatusModal}
          report={report}
          role="BUPATI"
          onSuccess={refetch}
        />
      )}

      {/* Modal Komentar */}
      {openCommentModal && (
        <CommentModal
          open={openCommentModal}
          setOpen={setOpenCommentModal}
          reportId={report.id}
        />
      )}
    </div>
  );
}
