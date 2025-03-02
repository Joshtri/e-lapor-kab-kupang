"use client";

import React from "react";
import ReportList from "@/components/bupati/report-list";

export default function LaporanBupatiPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Daftar Laporan
      </h1>
      <ReportList />
    </div>
  );
}
