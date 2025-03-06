"use client";

import { Select } from "flowbite-react";

export default function RiwayatFilterBar({ filterStatus, setFilterStatus }) {
  return (
    <Select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
    >
      <option value="ALL">Semua Status</option>
      <option value="PENDING">Pending</option>
      <option value="PROSES">Proses</option>
      <option value="SELESAI">Selesai</option>
      <option value="DITOLAK">Ditolak</option>
    </Select>
  );
}
