"use client";

import React, { useState } from "react";
import { Card, Label, Textarea, Button, Select } from "flowbite-react";

const BuatLaporan = () => {
  const [form, setForm] = useState({
    kategori: "",
    laporan: "",
  });

  // Fungsi menangani perubahan input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fungsi menangani submit formulir
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Laporan dikirim:", form);
    alert("Laporan Anda telah dikirim!");
    setForm({ kategori: "", laporan: "" }); // Reset hanya bagian laporan
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Buat Laporan</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Silakan isi formulir berikut untuk melaporkan permasalahan Anda.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Kategori Laporan */}
          <div className="mb-4">
            <Label htmlFor="kategori" className="text-gray-700 dark:text-gray-300">Kategori Laporan</Label>
            <Select
              id="kategori"
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              required
              className="dark:bg-gray-700 dark:text-white"
            >
              <option value="">Pilih Kategori</option>
              <option value="infrastruktur">Infrastruktur</option>
              <option value="pelayanan publik">Pelayanan Publik</option>
              <option value="sosial">Permasalahan Sosial</option>
              <option value="keamanan">Keamanan</option>
              <option value="lainnya">Lainnya</option>
            </Select>
          </div>

          {/* Isi Laporan */}
          <div className="mb-4">
            <Label htmlFor="laporan" className="text-gray-700 dark:text-gray-300">Detail Laporan</Label>
            <Textarea
              id="laporan"
              name="laporan"
              value={form.laporan}
              onChange={handleChange}
              placeholder="Jelaskan permasalahan yang Anda alami..."
              rows={4}
              required
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Tombol Kirim */}
          <div className="flex justify-end">
            <Button type="submit" gradientDuoTone="greenToBlue" className="w-full">
              Kirim Laporan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BuatLaporan;
