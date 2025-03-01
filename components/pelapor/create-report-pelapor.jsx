"use client";

import React, { useState } from "react";
import { Card, Label, Textarea, Button, Select, TextInput } from "flowbite-react";

const BuatLaporan = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
    status: "PENDING", // Status default
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
    setForm({ title: "", category: "", priority: "", description: "" }); // Reset hanya input laporan
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Buat Laporan</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Silakan isi formulir berikut untuk melaporkan permasalahan Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Laporan */}
          <div>
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Judul Laporan</Label>
            <TextInput
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Masukkan judul laporan..."
              required
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Kategori Laporan */}
          <div>
            <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Kategori Laporan</Label>
            <Select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="dark:bg-gray-700 dark:text-white"
            >
              <option value="">Pilih Kategori</option>
              <option value="INFRASTRUKTUR">Infrastruktur</option>
              <option value="PELAYANAN_PUBLIK">Pelayanan Publik</option>
              <option value="SOSIAL">Permasalahan Sosial</option>
              <option value="KEAMANAN">Keamanan</option>
              <option value="LAINNYA">Lainnya</option>
            </Select>
          </div>

          {/* Prioritas Laporan */}
          <div>
            <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Prioritas Laporan</Label>
            <Select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              required
              className="dark:bg-gray-700 dark:text-white"
            >
              <option value="">Pilih Prioritas</option>
              <option value="LOW">Rendah</option>
              <option value="MEDIUM">Sedang</option>
              <option value="HIGH">Tinggi</option>
            </Select>
          </div>

          {/* Isi Laporan */}
          <div>
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Detail Laporan</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
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
