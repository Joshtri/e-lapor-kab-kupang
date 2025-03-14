"use client";

import React from "react";

const statusClasses = {
  SELESAI: "bg-green-500",
  PROSES: "bg-yellow-500",
  PENDING: "bg-gray-500",
  DITOLAK: "bg-red-500",
  DEFAULT: "bg-gray-400",
};

const StatusBadge = ({ status }) => {
  const badgeClass = statusClasses[status] || statusClasses.DEFAULT;
  
  return (
    <span className={`px-3 py-1 rounded-full text-white text-sm ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
