"use client";

import React from "react";
import StatistikOverview from "@/components/bupati/statistic-overview";

export default function DashboardBupatiPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Dashboard Bupati
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Ikhtisar laporan masuk, status, dan aktivitas terbaru.
      </p>
      <StatistikOverview />
    </div>
  );
}
