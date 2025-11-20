'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Card, Spinner, Button } from 'flowbite-react';
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
import UpdateStatusModal from '@/components/bupati/UpdateStatusPelapor';
import CommentModal from '@/components/bupati/comment/comment-modal';
import ReportCommentView from './ReportComment';

const ReportView = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReportDetail();
    }
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      const res = await axios.get(`/api/reports/${id}`);
      setReport(res.data);
    } catch (error) {
      'Gagal mengambil detail laporan:', error;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Memuat detail laporan...
        </span>
      </div>
    );
  }

  if (!report) {
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
        title={`Detail Laporan: Warga ${report.pelapor}`}
        showBackButton={true}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/bupati-portal/dashboard' },
          customRoutes: {
            laporan: {
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
          Pelapor: {report.pelapor}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Kategori:
            </span>
            <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300">
              {report.kategori}
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
            <span
              className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${
                report.bupatiStatus === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : report.bupatiStatus === 'PROSES'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : report.bupatiStatus === 'SELESAI'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : report.bupatiStatus === 'DITOLAK'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              {report.bupatiStatus === 'PENDING' && (
                <HiOutlineClock className="w-4 h-4 mr-1" />
              )}
              {report.bupatiStatus === 'PROSES' && (
                <HiOutlineExclamation className="w-4 h-4 mr-1" />
              )}
              {report.bupatiStatus === 'SELESAI' && (
                <HiOutlineCheckCircle className="w-4 h-4 mr-1" />
              )}
              {report.bupatiStatus === 'DITOLAK' && (
                <HiOutlineXCircle className="w-4 h-4 mr-1" />
              )}
              {report.bupatiStatus}
            </span>
          </div>

          {/* Status OPD */}
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status OPD:
            </span>
            <span
              className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${
                report.opdStatus === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : report.opdStatus === 'PROSES'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : report.opdStatus === 'SELESAI'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : report.opdStatus === 'DITOLAK'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              {report.opdStatus === 'PENDING' && (
                <HiOutlineClock className="w-4 h-4 mr-1" />
              )}
              {report.opdStatus === 'PROSES' && (
                <HiOutlineExclamation className="w-4 h-4 mr-1" />
              )}
              {report.opdStatus === 'SELESAI' && (
                <HiOutlineCheckCircle className="w-4 h-4 mr-1" />
              )}
              {report.opdStatus === 'DITOLAK' && (
                <HiOutlineXCircle className="w-4 h-4 mr-1" />
              )}
              {report.opdStatus}
            </span>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dibuat pada:
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-2">
              {new Date(report.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Deskripsi:
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            {report.description}
          </p>
        </div>

        {report.image && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Lampiran:</h4>
            <img
              src={report.image || '/placeholder.svg'}
              alt="Lampiran Laporan"
              className="rounded-md max-w-sm"
            />
          </div>
        )}
      </Card>

      {/* Tampilkan Komentar di Bawah Detail Laporan */}
      <ReportCommentView reportId={report.id} />

      {/* Modal Ubah Status */}
      {openStatusModal && (
        <UpdateStatusModal
          open={openStatusModal}
          setOpen={setOpenStatusModal}
          report={report}
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
};

export default ReportView;
