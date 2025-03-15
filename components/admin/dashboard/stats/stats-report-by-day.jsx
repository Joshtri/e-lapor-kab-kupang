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

const StatsReportByDay = ({
  dailyReportStats,
  loadingDaily,
  selectedMonth,
  handleMonthChange,
}) => {
  return (
    <div className="dark:bg-gray-800 p-6 rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">Statistik Laporan (Per Hari)</h1>
      <p className="mb-3 text-gray-500 dark:text-gray-400">
        Statistik ini menampilkan jumlah laporan harian dalam bulan yang dipilih.
      </p>

      {/* 🔽 Dropdown untuk memilih bulan */}
      <div className="mb-4">
        <label className="text-gray-700 dark:text-gray-300 font-semibold">
          Pilih Bulan:
        </label>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="block w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-500"
        >
          {Array.from({ length: 12 }).map((_, index) => {
            const date = new Date();
            date.setMonth(date.getMonth() - index);
            const month = date.toISOString().slice(0, 7);
            return (
              <option key={month} value={month}>
                {date.toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                })}
              </option>
            );
          })}
        </select>
      </div>

      {/* 🔄 Loading atau Grafik */}
      {loadingDaily ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyReportStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            {/* 🛠 Custom Tooltip */}
            <RechartsTooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#ff7300"
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
          📅 {payload[0].payload.day}
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

export default StatsReportByDay;
