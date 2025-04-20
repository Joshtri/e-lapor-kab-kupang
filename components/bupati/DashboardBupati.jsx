'use client';

import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'flowbite-react';
import {
  FaClipboardList,
  FaUserFriends,
  FaCheckCircle,
  FaSpinner as FaSpinnerIcon,
  FaTimesCircle,
} from 'react-icons/fa';
import axios from 'axios';

const BupatiDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);
      const response = await axios.get('/api/reports/stats/admin-summary'); // API baru

      setStats(response.data.stats);
    } catch (error) {
      'Gagal mengambil data dashboard:', error;
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard Bupati
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
              <FaTimesCircle className="text-red-500 text-4xl" />
              <div>
                <h2 className="text-lg font-semibold">Ditolak</h2>
                <p className="text-2xl font-bold">{stats.rejected}</p>
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
    </div>
  );
};

export default BupatiDashboard;
