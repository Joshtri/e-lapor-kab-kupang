"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import axios from "axios";

const DashboardChart = ({ categoryStats, chartData, loading }) => {
  const [priorityStats, setPriorityStats] = useState([]);
  const [loadingPriority, setLoadingPriority] = useState(true);

  useEffect(() => {
    fetchPriorityStats();
  }, []);

  const fetchPriorityStats = async () => {
    try {
      setLoadingPriority(true);
      const response = await axios.get("/api/reports/stats/chart/priority");
      setPriorityStats(response.data.priorityStats);
    } catch (error) {
      console.error("Gagal mengambil data prioritas laporan:", error);
    } finally {
      setLoadingPriority(false);
    }
  };

  return (
    <>
      {/* 📈 Grafik Tren Laporan */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mt-8">
        <h1 className="text-2xl font-bold mb-4">Statistik Laporan</h1>
        {loading ? (
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
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <hr className="mt-10" />

      {/* 📂 Statistik Per Kategori */}
      <div className="p-6 mt-2">
        <h2 className="text-2xl font-bold mb-4">Statistik Per Kategori</h2>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
          {categoryStats.map((category) => (
            <li key={category.category}>
              <span className="font-semibold">{category.category}:</span>{" "}
              {category.total} laporan
            </li>
          ))}
        </ul>
      </div>

      <hr className="mt-10" />

      {/* 📊 Statistik Berdasarkan Prioritas */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mt-8">
        <h2 className="text-2xl font-bold mb-4">Statistik Berdasarkan Prioritas</h2>
        {loadingPriority ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default DashboardChart;
