// components/ui/data-view/DataView.jsx
"use client";

import { useState } from "react";
import PageHeader from "./PageHeader";
import DataFilterBar from "./DataFilterBar";
import DataTable from "./DataTable";
import DataGrid from "./DataGrid";
import * as entityConfigs from "./entityConfigs";

export default function DataView({
    entity,
    data = [],
    title = "Manajemen Data",
    onRefresh = () => {},
}) {
    const [viewMode, setViewMode] = useState("table");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterPriority, setFilterPriority] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const config = entityConfigs[entity]; // entity = 'reports'
    
   if (!config) return <div>Config untuk entitas '{entity}' tidak ditemukan.</div>;

  const filteredData = data.filter((item) => {
    const statusMatch =
      filterStatus === "ALL" || item[config.statusKey] === filterStatus;
    const priorityMatch =
      filterPriority === "ALL" || item[config.priorityKey] === filterPriority;
    const searchMatch = config.searchFields
      .map((field) => String(item[field] || ""))
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return statusMatch && priorityMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showRefreshButton
        onRefreshClick={onRefresh}
      />

      <DataFilterBar
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {filteredData.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Tidak ada data ditemukan.
        </div>
      ) : viewMode === "table" ? (
        <DataTable
          data={filteredData}
          columns={config.columns}
          actions={config.actions || []}
          rowClassName={config.rowClassName || (() => "")}
        />
      ) : (
        <DataGrid
          data={filteredData}
          renderItem={config.renderItem}
          modals={config.modals}
        />
      )}
    </div>
  );
}
