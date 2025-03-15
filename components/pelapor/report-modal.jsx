"use client";

import React, { useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
} from "flowbite-react";
import axios from "axios";
import { toast } from "sonner";

const ReportModal = ({ openModal, setOpenModal, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "LOW",
    description: "",
    status: "PENDING",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menangani submit laporan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`/api/reports`, { ...formData, userId: user.id });
      toast.success("Laporan berhasil dikirim!");
      setFormData({
        title: "",
        category: "",
        priority: "LOW",
        description: "",
      });
      // ✅ Kasih jeda 1.5 detik biar toast tampil dulu
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      setOpenModal(false);
    } catch (error) {
      toast.error("Gagal mengirim laporan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Buat Laporan Baru</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Judul Laporan */}
          <div>
            <Label htmlFor="title">
              Judul Laporan <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="title"
              name="title"
              placeholder="Masukkan judul laporan..."
              value={formData.title}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Contoh: Jalan rusak di dekat sekolah
            </p>
          </div>

          {/* Kategori Laporan */}
          <div>
            <Label htmlFor="category">
              Kategori Laporan <span className="text-red-500">*</span>
            </Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="INFRASTRUKTUR">Infrastruktur</option>
              <option value="PELAYANAN">Pelayanan Publik</option>
              <option value="SOSIAL">Permasalahan Sosial</option>
               <option value="LAINNYA">Lainnya</option>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pilih kategori yang sesuai dengan laporan Anda.
            </p>
          </div>

          {/* Prioritas Laporan */}
          <div>
            <Label htmlFor="priority">
              Prioritas <span className="text-red-500">*</span>
            </Label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="LOW">Rendah</option>
              <option value="MEDIUM">Sedang</option>
              <option value="HIGH">Tinggi</option>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pilih tingkat urgensi laporan ini.
            </p>
          </div>

          {/* Deskripsi Laporan */}
          <div>
            <Label htmlFor="description">
              Deskripsi Laporan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Jelaskan permasalahan yang Anda alami..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Berikan detail yang jelas agar laporan dapat ditindaklanjuti
              dengan baik.
            </p>
          </div>

          {/* Tombol Kirim */}
          <div className="flex justify-end">
            <Button type="submit" color="blue" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
