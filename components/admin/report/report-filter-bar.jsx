"use client";

import { Button, Dropdown, Select } from "flowbite-react";
import { HiOutlineTable, HiOutlineViewGrid, HiPlus } from "react-icons/hi";
import { CiFilter } from "react-icons/ci";

export default function ReportFilterBar({
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  viewMode,
  setViewMode,
  createButtonLabel,
  onCreateClick,
}) {
  return (
    <div className="flex flex-wrap items-center w-full gap-4">
      {/* 🔽 Dropdown Filter */}
      <Dropdown
        label={<CiFilter className="text-2xl" />}
        inline
        arrowIcon={false}
        dismissOnClick={false} // ✅ Agar tidak tertutup saat memilih opsi
      >
        <Dropdown.Item>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Status Laporan
            </label>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full"
              onClick={(e) => e.stopPropagation()} // ✅ Mencegah dropdown tertutup
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROSES">Proses</option>
              <option value="SELESAI">Selesai</option>
              <option value="DITOLAK">Ditolak</option>
            </Select>
          </div>
        </Dropdown.Item>

        <Dropdown.Item>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Prioritas Laporan
            </label>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full"
              onClick={(e) => e.stopPropagation()} // ✅ Mencegah dropdown tertutup
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="LOW">Rendah</option>
              <option value="MEDIUM">Sedang</option>
              <option value="HIGH">Tinggi</option>
            </Select>
          </div>
        </Dropdown.Item>
      </Dropdown>

      {/* 🔹 View Mode Switch */}
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

      {/* 🔹 Create Button DIPOSISIKAN DI END */}
      <div className="ml-auto">
        <Button color="blue" onClick={onCreateClick}>
          <HiPlus className="mr-2" />
          {createButtonLabel}
        </Button>
      </div>
    </div>
  );
}
