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
import { useUser } from "@/contexts/UserContext"; // ✅ Import useUser

const ReportModal = ({ openModal, setOpenModal }) => {
  const { users } = useUser(); // ✅ Ambil daftar user dengan role PELAPOR
  const [formData, setFormData] = useState({
    userId: "", // ✅ Simpan ID Pelapor (default kosong)
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

    // 🔥 Validasi jika admin lupa memilih pelapor
    if (!formData.userId) {
      toast.error("Pilih pelapor terlebih dahulu!");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`/api/reports`, {
        ...formData,
        userId: parseInt(formData.userId), // ✅ Pastikan userId dikirim sebagai angka
      });

      toast.success("Laporan berhasil dikirim!");
      setFormData({
        userId: "",
        title: "",
        category: "",
        priority: "LOW",
        description: "",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);

      setOpenModal(false);
    } catch (error) {
      console.error("Gagal mengirim laporan:", error);
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
          {/* Pilih Pelapor */}
          <div>
            <Label htmlFor="userId">
              Pilih Pelapor <span className="text-red-500">*</span>
            </Label>
            <Select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Pelapor</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </Select>
          </div>

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
              <option value="KEAMANAN">Keamanan</option>
              <option value="LAINNYA">Lainnya</option>
            </Select>
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
