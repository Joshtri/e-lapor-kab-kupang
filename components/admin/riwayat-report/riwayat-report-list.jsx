"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { toast } from "sonner";
import RiwayatFilterBar from "@/components/admin/riwayat-report/riwayat-report-filter-bar";
import RiwayatTable from "@/components/admin/riwayat-report/riwayat-report-table-view";
import RiwayatGrid from "@/components/admin/riwayat-report/riwayat-report-grid-view";

export default function RiwayatPengaduan() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/reports");
      setRiwayat(res.data);
    } catch (error) {
      console.error("Gagal mengambil data riwayat:", error);
      toast.error("Gagal mengambil data riwayat.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRiwayat = riwayat.filter((item) =>
    filterStatus === "ALL" ? true : item.status === filterStatus,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Riwayat Pengaduan</h1>

      <RiwayatFilterBar
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {filteredRiwayat.length === 0 ? (
        <p className="text-gray-600">Tidak ada riwayat pengaduan.</p>
      ) : viewMode === "table" ? (
        <RiwayatTable riwayat={filteredRiwayat} />
      ) : (
        <RiwayatGrid riwayat={filteredRiwayat} />
      )}
    </div>
  );
}
