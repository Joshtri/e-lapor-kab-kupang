"use client";

import { useState } from "react";
import { Table, Badge, Button } from "flowbite-react";
import {
  HiOutlineEye,
  HiOutlineChatAlt2,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import ReportView from "@/components/bupati/report/report-view";
import UpdateStatusModal from "@/components/bupati/update-status-pelapor";
import CommentModal from "@/components/bupati/comment/comment-modal";
import { useRouter } from "next/navigation";

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
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Prioritas</Table.HeadCell>
          <Table.HeadCell>Tanggal</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {reports.map((report) => (
            <Table.Row key={report.id}>
              <Table.Cell>{report.user?.name || "Anonim"}</Table.Cell>
              <Table.Cell>{report.title}</Table.Cell>
              <Table.Cell>{report.category}</Table.Cell>
              <Table.Cell>
                <Badge
                  color={
                    report.status === "SELESAI"
                      ? "green"
                      : report.status === "PROSES"
                        ? "yellow"
                        : report.status === "DITOLAK"
                          ? "red"
                          : "gray"
                  }
                >
                  {report.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>{report.priority}</Table.Cell>
              <Table.Cell>
                {new Date(report.createdAt).toLocaleDateString("id-ID")}
              </Table.Cell>
              <Table.Cell className="flex gap-2">
                <Button
                  color="gray"
                  size="sm"
                  onClick={() =>
                    router.push(`/bupati-portal/laporan-warga/${report.id}`)
                  }
                >
                  <HiOutlineEye className="w-4 h-4 mr-1" />
                  Detail
                </Button>
                <Button
                  color="purple"
                  size="sm"
                  onClick={() => {
                    setSelectedReport(report);
                    setOpenCommentModal(true);
                  }}
                >
                  <HiOutlineChatAlt2 className="w-4 h-4 mr-1" />
                  Komentar
                </Button>
                <Button
                  color="blue"
                  size="sm"
                  onClick={() => {
                    setSelectedReport(report);
                    setOpenStatusModal(true);
                  }}
                >
                  <HiOutlinePencilAlt className="w-4 h-4 mr-1" />
                  Ubah Status
                </Button>
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
