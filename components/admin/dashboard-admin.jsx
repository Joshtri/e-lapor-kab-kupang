"use client";

import React, { useState, useEffect } from "react";
import { Card, Spinner } from "flowbite-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaClipboardList,
  FaUserFriends,
  FaCheckCircle,
  FaSpinner as FaSpinnerIcon,
} from "react-icons/fa";
import axios from "axios";
import Link from "next/link";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentReports, setRecentReports] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);
      setLoadingChart(true);
      setLoadingReports(true);

      const response = await axios.get("/api/reports/stats/admin-summary");

      setStats(response.data.stats);
      setChartData(response.data.chartData);
      setRecentReports(response.data.recentReports);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoadingStats(false);
      setLoadingChart(false);
      setLoadingReports(false);
    }
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard Admin
      </h1>
      <p className="text-gray-500 dark:text-gray-300">
        Ringkasan laporan dan pengguna
      </p>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {loadingStats ? (
          <div className="col-span-4 flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <Card className="flex items-center gap-4 p-6 shadow-md">
              <FaClipboardList className="text-blue-500 text-4xl" />
              <div>
                <h2 className="text-lg font-semibold">Total Laporan</h2>
                <p className="text-2xl font-bold">{stats.totalReports}</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 p-6 shadow-md">
              <FaSpinnerIcon className="text-yellow-500 text-4xl animate-spin" />
              <div>
                <h2 className="text-lg font-semibold">Sedang Diproses</h2>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 p-6 shadow-md">
              <FaCheckCircle className="text-green-500 text-4xl" />
              <div>
                <h2 className="text-lg font-semibold">Selesai</h2>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 p-6 shadow-md">
              <FaUserFriends className="text-purple-500 text-4xl" />
              <div>
                <h2 className="text-lg font-semibold">Total Pengguna</h2>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Grafik Statistik */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mt-8">
        <h2 className="text-xl font-bold mb-4">Statistik Laporan</h2>
        {loadingChart ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tabel Laporan Terbaru */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mt-8">
        <h2 className="text-xl font-bold mb-4">Laporan Terbaru</h2>
        {loadingReports ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Pelapor</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Status</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.length > 0 ? (
                recentReports.map((report, index) => (
                  <tr key={report.id} className="border-b dark:border-gray-600">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{report.pelapor}</td>
                    <td className="p-2">{report.kategori}</td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${statusBadge(
                          report.status,
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <Link href={`/admin/laporan/${report.id}`}>
                        <span className="text-blue-500 hover:underline cursor-pointer">
                          Detail
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Tidak ada laporan terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
