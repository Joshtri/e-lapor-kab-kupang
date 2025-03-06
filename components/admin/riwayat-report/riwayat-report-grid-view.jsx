"use client";

import { Card, Badge } from "flowbite-react";

export default function RiwayatGrid({ riwayat }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {riwayat.map((item) => (
        <Card key={item.id} className="p-4 shadow-md">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.category}</p>
          <div className="flex gap-2 mt-2">
            <Badge color={
              item.status === "SELESAI"
                ? "green"
                : item.status === "PROSES"
                ? "yellow"
                : item.status === "DITOLAK"
                ? "red"
                : "gray"
            }>
              {item.status}
            </Badge>
            <Badge color="blue">{item.priority}</Badge>
          </div>
          <p className="text-sm mt-2 text-gray-400">
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </Card>
      ))}
    </div>
  );
}
