'use client';

import { Card } from 'flowbite-react';
import { useState } from 'react';

/**
 * Komponen grid generik untuk semua entitas
 * @param {Array} data - array data yang ditampilkan
 * @param {Function} renderItem - fungsi untuk merender isi kartu
 * @param {ReactNode[]} modals - komponen modal yang akan dirender di luar grid
 */
export default function DataGrid({ data = [], renderItem, modals = null }) {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <Card
            key={item.id}
            className="p-5 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl
              bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900
              transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            {renderItem(item, { setSelectedItem })}
          </Card>
        ))}
      </div>

      {/* 🧩 Optional: Tambahkan modals di luar loop */}
      {modals && modals(selectedItem, setSelectedItem)}
    </>
  );
}
