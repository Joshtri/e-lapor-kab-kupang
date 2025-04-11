'use client';

import { useState } from 'react';
import { Table, Badge, Button, Tooltip } from 'flowbite-react';
import {
  HiOutlineEye,
  HiOutlineChatAlt2,
  HiOutlinePencilAlt,
} from 'react-icons/hi';
import ReportView from '@/components/bupati/report/report-view';
import UpdateStatusModal from '@/components/bupati/UpdateStatusPelapor';
import CommentModal from '@/components/bupati/comment/comment-modal';
import { useRouter } from 'next/navigation';

export default function ReportTable({ reports }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const router = useRouter();

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  return (
    <>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Nama Pelapor</Table.HeadCell>
          <Table.HeadCell>Subjek</Table.HeadCell>
          <Table.HeadCell>Kategori</Table.HeadCell>
          <Table.HeadCell>Status Bupati</Table.HeadCell>
          <Table.HeadCell>Status OPD terkait</Table.HeadCell>
          <Table.HeadCell>OPD Terkait</Table.HeadCell> {/* 🆕 */}
          <Table.HeadCell>Prioritas</Table.HeadCell>
          <Table.HeadCell>Tanggal</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {reports.map((report) => (
            <Table.Row key={report.id}>
              <Table.Cell>{report.user?.name || 'Anonim'}</Table.Cell>
              <Table.Cell>{report.title}</Table.Cell>
              <Table.Cell>{report.category}</Table.Cell>
              <Table.Cell>
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
                >
                  {report.bupatiStatus}
                </Badge>
              </Table.Cell>
              <Table.Cell>
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
                >
                  {report.opdStatus}
                </Badge>
              </Table.Cell>
              <Table.Cell>{report.opd?.name || '-'}</Table.Cell>

              <Table.Cell>{report.priority}</Table.Cell>
              <Table.Cell>
                {new Date(report.createdAt).toLocaleDateString('id-ID')}
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2 justify-start">
                  <Tooltip content="Lihat Detail" placement="top">
                    <Button
                      color="gray"
                      size="xs"
                      onClick={() =>
                        router.push(`/bupati-portal/laporan-warga/${report.id}`)
                      }
                      className="p-2"
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
                      className="p-2"
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
                      className="p-2"
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
        <UpdateStatusModal
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
    </>
  );
}
