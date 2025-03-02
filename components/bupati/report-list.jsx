"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Badge, Button } from "flowbite-react";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineChatAlt2,
  HiOutlineEye,
} from "react-icons/hi";
import UpdateStatusModal from "./update-status-pelapor";
import CommentModal from "./comment-modal";
import Link from "next/link";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/reports");
        setReports(res.data);
      } catch (error) {
        console.error("Gagal mengambil laporan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge color="yellow" icon={HiOutlineClock}>
            Pending
          </Badge>
        );
      case "PROSES":
        return (
          <Badge color="blue" icon={HiOutlineExclamation}>
            Sedang Diproses
          </Badge>
        );
      case "SELESAI":
        return (
          <Badge color="green" icon={HiOutlineCheckCircle}>
            Selesai
          </Badge>
        );
      default:
        return <Badge color="gray">Tidak Diketahui</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-4">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Memuat laporan...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="space-y-4 mt-4">
        {reports.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Tidak ada laporan.</p>
        ) : (
          reports.map((report) => (
            <Card
              key={report.id}
              className="p-4 shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pelapor: {report.user?.name || "Tidak diketahui"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {report.description}
                  </p>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Kategori:
                      </span>
                      <Badge color="indigo">{report.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Prioritas:
                      </span>
                      <Badge color="red">{report.priority}</Badge>
                    </div>
                  </div>

                  <div className="mt-2">{getStatusBadge(report.status)}</div>
                </div>

                <div className="flex flex-col gap-2 mt-4 md:mt-0 md:flex-row">
                  <Link href={`/bupati/laporan/${report.id}`}>
                    <Button color="gray" size="sm" icon={HiOutlineEye}>
                      Detail
                    </Button>
                  </Link>
                  <Button
                    color="purple"
                    size="sm"
                    icon={HiOutlineChatAlt2}
                    onClick={() => {
                      setSelectedReport(report);
                      setOpenCommentModal(true);
                    }}
                  >
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
                    Ubah Status
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

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
    </div>
  );
};

export default ReportList;
