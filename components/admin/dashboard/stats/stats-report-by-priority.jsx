import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Spinner } from "flowbite-react";

const StatsReportByPriority = ({ loadingPriority, priorityStats }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Statistik Berdasarkan Prioritas
      </h2>
      <p className="mb-3 text-gray-500 dark:text-gray-400">
        Statistik Berdasarkan Prioritas menyajikan data jumlah laporan untuk
        menunjukkan prioritas pengaduan yang paling sering dilaporkan.
      </p>
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
  );
};

export default StatsReportByPriority;
