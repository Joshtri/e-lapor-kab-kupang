"use client";

import React from "react";
import { Spinner } from "flowbite-react";
import StatusBadge from "@/components/ui/status-badge";
import Link from "next/link";

const DashboardReports = ({ reports, loading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mt-8">
      <h2 className="text-xl font-bold mb-4">Laporan Terbaru</h2>
      {loading ? (
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
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={report.id} className="border-b dark:border-gray-600">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{report.pelapor}</td>
                  <td className="p-2">{report.kategori}</td>
                  <td className="p-2"><StatusBadge status={report.status} /></td>
                  <td className="p-2">
                    <Link href={`/adm/laporan/${report.id}`} className="text-blue-500 hover:underline">Detail</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center p-4 text-gray-500">Tidak ada laporan terbaru.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardReports;
