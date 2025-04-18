'use client';

import { useState } from 'react';
import { Table, Badge, Button, Tooltip } from 'flowbite-react';
import { HiOutlineEye, HiPencilAlt, HiChatAlt2, HiEye } from 'react-icons/hi';
import ReportDetail from './ReportDetail';
import UpdateStatusModalByOpd from './ReportUpdateStatusByOpd';
import CommentModal from '../comment/CommentModal';
import Link from 'next/link';

export default function ReportTable({ reports }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const openDetailModal = (report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const openStatusModal = (report) => {
    setSelectedReport(report);
    setIsStatusModalOpen(true);
  };

  const openCommentModal = (report) => {
    setSelectedReport(report);
    setIsCommentModalOpen(true);
  };

  return (
    <>
      {/* 📊 Tabel Laporan */}
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Nama Pelapor</Table.HeadCell>
          <Table.HeadCell>Subjek</Table.HeadCell>
          <Table.HeadCell>Kategori</Table.HeadCell>
          <Table.HeadCell>Status Bupati</Table.HeadCell>
          <Table.HeadCell>OPD Terkait</Table.HeadCell>
          <Table.HeadCell>Prioritas</Table.HeadCell>
          <Table.HeadCell>Tanggal</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {reports.map((report) => (
            <Table.Row key={report.id}>
              <Table.Cell>{report.user.name}</Table.Cell>
              <Table.Cell>{report.title}</Table.Cell>
              <Table.Cell>{report.category}</Table.Cell>
              <Table.Cell>
                <Badge
                  color={
                    report.status === 'SELESAI'
                      ? 'green'
                      : report.status === 'PROSES'
                        ? 'yellow'
                        : report.status === 'DITOLAK'
                          ? 'red'
                          : 'gray'
                  }
                >
                  {report.bupatiStatus}
                </Badge>
              </Table.Cell>

              <Table.Cell>{report.opd?.name || 'not found'}</Table.Cell>
              <Table.Cell>{report.priority}</Table.Cell>
              <Table.Cell>
                {new Date(report.createdAt).toLocaleDateString('id-ID')}
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-2">
                  {/* Lihat Detail */}
                  <Tooltip content="Lihat Detail">
                    <Link href={`/opd/laporan-warga/${report.id}`}>
                      <Button
                        size="xs"
                        color="gray"
                        className="p-2"
                        aria-label="Lihat Detail Laporan"
                      >
                        <HiEye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </Tooltip>

                  {/* Ubah Status */}
                  <Tooltip content="Ubah Status">
                    <Button
                      size="xs"
                      color="purple"
                      onClick={() => openStatusModal(report)}
                      className="p-2"
                      aria-label="Ubah Status"
                    >
                      <HiPencilAlt className="w-4 h-4" />
                    </Button>
                  </Tooltip>

                  {/* Ubah Komentar */}
                  <Tooltip content="Komentar Laporan">
                    <Button
                      size="xs"
                      color="teal"
                      onClick={() => openCommentModal(report)}
                      className="p-2"
                      aria-label="Komentar Laporan"
                    >
                      <HiChatAlt2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* 🆕 Modal Detail */}
      {selectedReport && isDetailModalOpen && (
        <ReportDetail
          report={selectedReport}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      {/* 🆕 Modal Ubah Status */}
      {selectedReport && isStatusModalOpen && (
        <UpdateStatusModalByOpd
          open={isStatusModalOpen}
          setOpen={setIsStatusModalOpen}
          report={selectedReport}
        />
      )}

      {/* 🆕 Modal Komentar */}
      {selectedReport && isCommentModalOpen && (
        <CommentModal
          open={isCommentModalOpen}
          setOpen={setIsCommentModalOpen}
          reportId={selectedReport.id}
        />
      )}
    </>
  );
}
