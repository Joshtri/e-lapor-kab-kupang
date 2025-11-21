"use client";

import { Spinner } from "flowbite-react";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

const StatsReportByMonth = ({ chartData, isLoading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">Statistik Laporan (Per Bulan)</h1>

      <p className="mb-3 text-gray-500 dark:text-gray-400">
        Statistik ini menampilkan jumlah laporan yang diajukan oleh pelapor
        setiap bulan, memberikan gambaran statistik yang jelas mengenai tren
        pengaduan bulanan.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            {/* 🛠 Custom Tooltip */}
            <RechartsTooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }} // Menambah titik pada grafik
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

/* 🛠 Custom Tooltip untuk menampilkan jumlah laporan */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-md">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          📅 {payload[0].payload.month}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Jumlah Laporan: </span>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default StatsReportByMonth;
