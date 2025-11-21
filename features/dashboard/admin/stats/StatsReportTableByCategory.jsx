import React from "react";

const StatsReportTableByCategory = ({ categoryStats }) => {
  return (
    <>
      {/* 📂 Statistik Per Kategori */}
      <div className="p-6 mt-2 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Statistik Per Kategori</h2>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
          {categoryStats.map((category) => (
            <li key={category.category}>
              <span className="font-semibold">{category.category}:</span>{" "}
              {category.total} laporan
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default StatsReportTableByCategory;
