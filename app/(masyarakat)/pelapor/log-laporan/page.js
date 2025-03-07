"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Badge } from "flowbite-react";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineChatAlt2,
} from "react-icons/hi";

export default function LogLaporanPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const resUser = await axios.get("/api/auth/me");
        const userId = resUser.data.user.id;

        const res = await axios.get(`/api/reports?userId=${userId}`);
        setReports(res.data);
      } catch (error) {
        console.error("Gagal mengambil laporan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Spinner size="lg" />
        <span className="ml-2">Memuat log laporan...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Riwayat Laporan Anda
      </h1>

      {reports.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Anda belum memiliki laporan.
        </p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const latestComment = report.comments?.find(
              (comment) => comment.user.role === "PELAPOR",
            );

            return (
              <Card
                key={report.id}
                className="p-4 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Status: <Badge color="blue">{report.status}</Badge>
                    </p>
                    {latestComment ? (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <HiOutlineChatAlt2 className="inline-block mr-1" />
                          Komentar Bupati:
                        </p>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">
                          &quot;{latestComment.comment}&quot;
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Belum ada komentar dari Bupati.
                      </p>
                    )}
                  </div>
                  <Badge color="gray" icon={HiOutlineClock}>
                    {new Date(report.updatedAt).toLocaleString()}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
