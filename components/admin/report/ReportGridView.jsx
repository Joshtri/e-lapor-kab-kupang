"use client";

import { Card, Badge, Button, Avatar } from "flowbite-react";
import { HiOutlineEye } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function ReportGrid({ reports }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Card
          key={report.id}
          className="p-5 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl
            bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900
            transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
        >
          {/* 🆔 Header: Avatar & Nama Pelapor */}
          <div className="flex items-center gap-3">
            <Avatar
              img={`https://ui-avatars.com/api/?name=${report.user?.name}&background=random`}
              rounded
              size="sm"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {report.user?.name || "Anonim"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(report.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>

          {/* 📝 Judul Laporan */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
            {report.title}
          </h3>

          {/* 📌 Kategori */}
          <p className="text-sm text-gray-600 dark:text-gray-400">{report.category}</p>

          {/* 🏷️ Status & Prioritas */}
          <div className="flex gap-2 mt-3">
            <Badge
              color={
                report.status === "SELESAI"
                  ? "green"
                  : report.status === "PROSES"
                  ? "yellow"
                  : report.status === "DITOLAK"
                  ? "red"
                  : "gray"
              }
              className="text-xs font-semibold px-3 py-1"
            >
              {report.status}
            </Badge>
            <Badge color="blue" className="text-xs font-semibold px-3 py-1">
              {report.priority}
            </Badge>
          </div>

          {/* 🔘 Tombol Aksi */}
          {/* <Button
            color="blue"
            size="sm"
            icon={HiOutlineEye}
            onClick={() => router.push(`/admin/reports/${report.id}`)}
            className="w-full mt-4 transition-all hover:scale-105"
          >
            Lihat Detail
          </Button> */}
        </Card>
      ))}
    </div>
  );
}
