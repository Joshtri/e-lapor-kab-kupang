'use client';

import { useState } from 'react';
import { Table, Badge, Button, Tooltip } from 'flowbite-react';
import { HiOutlineEye, HiPencilAlt, HiChatAlt2 } from 'react-icons/hi';
import ReportDetail from './ReportDetail';
import UpdateStatusModalByAdmin from './ReportUpdateStatus';
import CommentModal from '../comment/CommentModal';
import InlineOPDSelector from './InlineOPDSelector';

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
              <Table.Cell>
                <InlineOPDSelector
                  report={report}
                  onUpdated={() => fetchReports()}
                />
              </Table.Cell>
              {/* <Table.Cell>{report.opd?.name || "not found"}</Table.Cell> */}
              <Table.Cell>{report.priority}</Table.Cell>
              <Table.Cell>
                {new Date(report.createdAt).toLocaleDateString('id-ID')}
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Tooltip content="Lihat Detail">
                    <Button
                      size="xs"
                      color="gray"
                      className="p-2"
                      onClick={() => openDetailModal(report)}
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Ubah Status">
                    <Button
                      size="xs"
                      color="gray"
                      className="p-2"
                      onClick={() => openStatusModal(report)}
                    >
                      <HiPencilAlt className="w-4 h-4" />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Lihat Komentar">
                    <Button
                      size="xs"
                      color="gray"
                      className="p-2"
                      onClick={() => openCommentModal(report)}
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
        <UpdateStatusModalByAdmin
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
