"use client";

import { Select, Button } from "flowbite-react";
import { HiOutlineTable, HiOutlineViewGrid } from "react-icons/hi";

export default function ReportFilterBar({ filterStatus, setFilterStatus, viewMode, setViewMode }) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
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

      <div className="flex gap-2">
        <Button
          color={viewMode === "table" ? "blue" : "gray"}
          onClick={() => setViewMode("table")}
        >
          <HiOutlineTable className="mr-2" />
          Tabel
        </Button>
        <Button
          color={viewMode === "grid" ? "blue" : "gray"}
          onClick={() => setViewMode("grid")}
        >
          <HiOutlineViewGrid className="mr-2" />
          Grid
        </Button>
      </div>
    </div>
  );
}
