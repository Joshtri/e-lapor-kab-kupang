"use client";

import { Select, Button } from "flowbite-react";
import { HiOutlineTable, HiOutlineViewGrid } from "react-icons/hi";

export default function UserFilterBar({
  filterRole,
  setFilterRole,
  viewMode,
  setViewMode,
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
      >
        <option value="ALL">Semua Role</option>
        <option value="PELAPOR">Pelapor</option>
        <option value="ADMIN">Admin</option>
        <option value="BUPATI">Bupati</option>
        <option value="OPD">Opd</option>
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
