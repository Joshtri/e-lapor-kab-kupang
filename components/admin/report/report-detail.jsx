"use client";

import { Badge, Button, Card, HR, Modal, Tooltip } from "flowbite-react";
import { HiOutlineClipboardList } from "react-icons/hi";

export default function ReportDetail({ report, isOpen, onClose }) {
  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div className="flex items-center space-x-2">
          <HiOutlineClipboardList className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold">Detail Laporan</span>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-4">
          {/* 📌 Judul Laporan */}
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Judul Laporan:
            </span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
              {report.title}
            </h2>
          </div>

          {/* 📝 Deskripsi dalam Card */}
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Deskripsi:
            </span>
            <Card className="mt-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-3 rounded-lg shadow-md">
              <div className="max-h-32 overflow-y-auto text-gray-700 dark:text-gray-300">
                {report.description}
              </div>
            </Card>
          </div>

          <HR/>
          {/* 📌 Info Kategori, Status, & Prioritas */}
          <div className="flex flex-wrap gap-3">
            <Tooltip content="Kategori laporan ini">
              <Badge color="info">{report.category}</Badge>
            </Tooltip>

            <Tooltip content="Status terkini laporan">
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
            </Tooltip>

            <Tooltip content="Tingkat prioritas laporan">
              <Badge color="blue">{report.priority}</Badge>
            </Tooltip>
          </div>

          {/* 📅 Tanggal Laporan */}
          <Tooltip content="Tanggal laporan dibuat">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Diajukan pada:{" "}
              <span className="font-medium">
                {new Date(report.createdAt).toLocaleDateString("id-ID")}
              </span>
            </p>
          </Tooltip>
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
