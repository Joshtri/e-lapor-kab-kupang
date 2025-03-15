"use client";

import ReportFilterBar from "@/components/admin/report/report-filter-bar";
import ReportGrid from "@/components/bupati/report/report-grid-view";
import ReportTable from "@/components/bupati/report/report-table-view";
import PageHeader from "@/components/ui/page-header";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ReportModal from "@/components/admin/report/report-create";

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [openModal, setOpenModal] = useState(false);

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

  const filteredReports = reports.filter((report) => {
    const statusMatch = filterStatus === "ALL" || report.status === filterStatus;
    const priorityMatch = filterPriority === "ALL" || report.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      <PageHeader
        title="Manajemen Laporan"
        showBackButton={false}
        showSearch
        showRefreshButton
        onRefreshClick={fetchReports}
        breadcrumbsProps={{
          home: { label: "Beranda", href: "/adm/dashboard" },
          customRoutes: {
            adm: { label: "Dashboard Admin", href: "/adm/dashboard" },
          },
        }}
      />
      <div className="flex items-center justify-between">
        <ReportFilterBar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showCreateButton={false}
        />
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Tidak ada laporan dengan filter ini.
        </p>
      ) : viewMode === "table" ? (
        <ReportTable reports={filteredReports} />
      ) : (
        <ReportGrid reports={filteredReports} />
      )}

      <ReportModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
