"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Badge, Button } from "flowbite-react";
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamation } from "react-icons/hi";
import UpdateStatusModal from "./update-status-pelapor";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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
      case "pending":
        return <Badge color="yellow" icon={HiOutlineClock}>Pending</Badge>;
      case "in_progress":
        return <Badge color="blue" icon={HiOutlineExclamation}>Sedang Diproses</Badge>;
      case "completed":
        return <Badge color="green" icon={HiOutlineCheckCircle}>Selesai</Badge>;
      default:
        return <Badge color="gray">Tidak Diketahui</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-4">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Memuat laporan...</span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Daftar Laporan</h2>
      <div className="space-y-4 mt-4">
        {reports.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Tidak ada laporan.</p>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="p-4 shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{report.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{report.description}</p>
              <div className="flex items-center justify-between mt-4">
                {getStatusBadge(report.status)}
                <Button color="blue" onClick={() => { setSelectedReport(report); setOpenModal(true); }}>
                  Ubah Status
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal untuk Mengubah Status */}
      {selectedReport && <UpdateStatusModal open={openModal} setOpen={setOpenModal} report={selectedReport} />}
    </div>
  );
};

export default ReportList;
