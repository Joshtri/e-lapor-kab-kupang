'use client';

import { useState, useEffect } from 'react';
import { Spinner, Tooltip } from 'flowbite-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';
import axios from 'axios';

const StatsReportByDailyCategory = () => {
  const [dailyCategoryStats, setDailyCategoryStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // ✅ Fetch categories from database on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDailyCategoryStats(selectedMonth, selectedCategory);
  }, [selectedMonth, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories', {
        params: { activeOnly: true },
      });
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Gagal mengambil data kategori:', error);
    }
  };

  const fetchDailyCategoryStats = async (month, category) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/reports/stats/chart/daily/daily-category`,
        {
          params: { month, category },
        },
      );
      setDailyCategoryStats(response.data.dailyCategoryStats);
    } catch (error) {
      'Gagal mengambil data laporan harian berdasarkan kategori:', error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-gray-800 p-6 rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Statistik Laporan Harian Berdasarkan Kategori
      </h1>
      <p className="mb-3 text-gray-500 dark:text-gray-400">
        Statistik ini menampilkan jumlah laporan harian dalam bulan yang dipilih
        berdasarkan kategori laporan.
      </p>

      {/* 🔽 Dropdown untuk memilih bulan */}
      <div className="mb-4">
        <label className="text-gray-700 dark:text-gray-300 font-semibold">
          Pilih Bulan:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="block w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-500"
        >
          {Array.from({ length: 12 }).map((_, index) => {
            const date = new Date();
            date.setMonth(date.getMonth() - index);
            const month = date.toISOString().slice(0, 7);
            return (
              <option key={month} value={month}>
                {date.toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                })}
              </option>
            );
          })}
        </select>
      </div>

      {/* 🔽 Dropdown untuk memilih kategori laporan (dinamis dari database) */}
      <div className="mb-4">
        <label className="text-gray-700 dark:text-gray-300 font-semibold">
          Pilih Kategori:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-500"
        >
          <option value="ALL">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔄 Loading atau Grafik */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : dailyCategoryStats.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <p className="text-lg font-semibold">
            📉 Tidak ada laporan dalam kategori ini untuk bulan yang dipilih.
          </p>
          <p className="text-sm">
            Coba pilih kategori lain atau bulan yang berbeda.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyCategoryStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <RechartsTooltip
              content={<CustomTooltip category={selectedCategory} />}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#ff7300"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

/* 🛠 Custom Tooltip untuk menampilkan kategori laporan saat "Semua Kategori" dipilih */
const CustomTooltip = ({ active, payload, category }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-md">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          {payload[0].payload.day}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Jumlah: </span>
          {payload[0].value} laporan
        </p>
        {category === 'ALL' && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Kategori: </span>
            {payload[0].payload.category || 'Tidak diketahui'}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default StatsReportByDailyCategory;
