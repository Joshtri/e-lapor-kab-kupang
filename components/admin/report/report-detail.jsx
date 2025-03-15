"use client";

import { Modal, Button, Badge } from "flowbite-react";
import { HiX, HiOutlineClipboardList } from "react-icons/hi";

export default function ReportDetail({ report, isOpen, onClose }) {
  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div className="flex items-center space-x-2">
          <HiOutlineClipboardList className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold">Detail Laporan</span>
        </div>
        <Button size="sm" color="gray" onClick={onClose} className="p-1">
          <HiX className="h-5 w-5" />
        </Button>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-3">
          <h2 className="text-xl font-bold">{report.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{report.description}</p>

          {/* 📌 Info Kategori, Status, & Prioritas */}
          <div className="flex flex-wrap gap-3">
            <Badge color="info">{report.category}</Badge>
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
            <Badge color="blue">{report.priority}</Badge>
          </div>

          {/* 📅 Tanggal Laporan */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Diajukan pada:{" "}
            <span className="font-medium">
              {new Date(report.createdAt).toLocaleDateString("id-ID")}
            </span>
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
