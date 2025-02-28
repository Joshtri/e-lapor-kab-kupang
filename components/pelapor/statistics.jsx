"use client";

import React from "react";
import { Card } from "flowbite-react";
import {
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineCheckCircle,
} from "react-icons/hi";

const Statistics = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-10 mb-4">Statistik Laporan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Laporan", value: 125, icon: HiOutlineDocumentText, color: "text-blue-500" },
          { title: "Laporan Selesai", value: 98, icon: HiOutlineCheckCircle, color: "text-green-500" },
          { title: "Dalam Proses", value: 27, icon: HiOutlineUsers, color: "text-red-500" },
        ].map(({ title, value, icon: Icon, color }) => (
          <Card key={title} className="p-5 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <Icon className={`${color} text-4xl`} />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
