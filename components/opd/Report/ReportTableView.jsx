'use client';

import { useState } from 'react';
import { Table, Badge, Button } from 'flowbite-react';
import { HiOutlineEye, HiPencilAlt, HiChatAlt2 } from 'react-icons/hi';
import ReportDetail from './ReportDetail';
import UpdateStatusModalByOpd from './ReportUpdateStatusByOpd';
import CommentModal from '../comment/CommentModal';

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
                  <Button
                    size="xs"
                    color="blue"
                    onClick={() => openDetailModal(report)}
                  >
                    <HiOutlineEye className="mr-1 h-4 w-4" />
                    Lihat
                  </Button>
                  <Button
                    size="xs"
                    color="purple"
                    onClick={() => openStatusModal(report)} // pastikan state `report` terisi
                  >
                    <HiPencilAlt className="mr-1 h-4 w-4" />
                    Status OPD
                  </Button>
                  <Button
                    size="xs"
                    color="teal"
                    onClick={() => openCommentModal(report)}
                  >
                    <HiChatAlt2 className="mr-1 h-4 w-4" />
                    Komentar
                  </Button>
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
