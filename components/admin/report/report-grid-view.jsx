"use client";

import { Card, Badge } from "flowbite-react";

export default function ReportGrid({ reports }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Card key={report.id} className="p-4 shadow-md">
          <h3 className="text-lg font-semibold">{report.title}</h3>
          <p className="text-sm text-gray-500">{report.category}</p>
          <div className="flex gap-2 mt-2">
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
            >
              {report.status}
            </Badge>
            <Badge color="blue">{report.priority}</Badge>
          </div>
          <p className="text-sm mt-2 text-gray-400">
            {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </Card>
      ))}
    </div>
  );
}
