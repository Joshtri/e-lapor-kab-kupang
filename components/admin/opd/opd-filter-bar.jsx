"use client";

import { Select, Button } from "flowbite-react";
import { HiOutlineTable, HiOutlineViewGrid } from "react-icons/hi";

export default function OPDFilterBar({ filterWilayah, setFilterWilayah, viewMode, setViewMode }) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select value={filterWilayah} onChange={(e) => setFilterWilayah(e.target.value)}>
        <option value="ALL">Semua Wilayah</option>
        <option value="Kota Kupang">Kota Kupang</option>
        <option value="Kabupaten Flores">Kabupaten Flores</option>
        <option value="Kabupaten Timor">Kabupaten Timor</option>
      </Select>

      <div className="flex gap-2">
        <Button color={viewMode === "table" ? "blue" : "gray"} onClick={() => setViewMode("table")}>
          <HiOutlineTable className="mr-2" />
          Tabel
        </Button>
        <Button color={viewMode === "grid" ? "blue" : "gray"} onClick={() => setViewMode("grid")}>
          <HiOutlineViewGrid className="mr-2" />
          Grid
        </Button>
      </div>
    </div>
  );
}
