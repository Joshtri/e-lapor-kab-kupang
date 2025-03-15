"use client";

import { useState } from "react";
import { Table, Badge, Button } from "flowbite-react";
import { HiOutlineEye } from "react-icons/hi";
import ReportDetail from "./report-detail"; // 🆕 Import komponen modal

export default function ReportTable({ reports }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* 📊 Tabel Laporan */}
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Judul</Table.HeadCell>
          <Table.HeadCell>Kategori</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Prioritas</Table.HeadCell>
          <Table.HeadCell>Tanggal</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {reports.map((report) => (
            <Table.Row key={report.id}>
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
              <Table.Cell>
                <Button
                  color="blue"
                  size="sm"
                  icon={HiOutlineEye}
                  onClick={() => openModal(report)} // 🆕 Buka Modal
                >
                  Lihat Detail
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* 🆕 Komponen Modal Report Detail */}
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
