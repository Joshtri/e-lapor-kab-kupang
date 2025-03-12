"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Spinner, Card } from "flowbite-react";

const ReportDetailPage = ({ params }) => {
  const router = useRouter();
  const { id } = params; // Get report ID from URL
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchReportDetail();
    }
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      const response = await axios.get(`/api/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error("Failed to fetch report details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-gray-500 py-10">
        Data laporan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Detail Laporan
      </h1>
      <p className="text-gray-500 dark:text-gray-300">
        Informasi lengkap tentang laporan #{id}
      </p>

      <Card className="mt-6 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {report.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{report.description}</p>

        <div className="mt-4 space-y-2">
          <p>
            <strong className="text-gray-800 dark:text-white">Pelapor:</strong>{" "}
            {report.pelapor}
          </p>
          <p>
            <strong className="text-gray-800 dark:text-white">Kategori:</strong>{" "}
            {report.kategori}
          </p>
          <p>
            <strong className="text-gray-800 dark:text-white">Status:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${statusBadge(
                report.status
              )}`}
            >
              {report.status}
            </span>
          </p>
          <p>
            <strong className="text-gray-800 dark:text-white">Tanggal:</strong>{" "}
            {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Card>

      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => router.back()}
      >
        Kembali
      </button>
    </div>
  );
};

const statusBadge = (status) => {
  switch (status) {
    case "SELESAI":
      return "bg-green-500";
    case "PROSES":
      return "bg-yellow-500";
    case "PENDING":
      return "bg-gray-500";
    case "DITOLAK":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

export default ReportDetailPage;
