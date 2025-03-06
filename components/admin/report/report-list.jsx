"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { HiOutlineRefresh } from "react-icons/hi";
import { toast } from "sonner";
import ReportFilterBar from "@/components/admin/report/report-filter-bar";
import ReportGrid from "@/components/admin/report/report-grid-view";
import ReportTable from "@/components/admin/report/report-table-view";

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // Default ke table
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/reports");
      setReports(res.data);
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
      toast.error("Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) =>
    filterStatus === "ALL" ? true : report.status === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manajemen Laporan
        </h1>
        <Button color="blue" onClick={fetchReports} icon={HiOutlineRefresh}>
          Refresh Data
        </Button>
      </div>

      <ReportFilterBar
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {filteredReports.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Tidak ada laporan dengan filter ini.
        </p>
      ) : viewMode === "table" ? (
        <ReportTable reports={filteredReports} />
      ) : (
        <ReportGrid reports={filteredReports} />
      )}
    </div>
  );
}
