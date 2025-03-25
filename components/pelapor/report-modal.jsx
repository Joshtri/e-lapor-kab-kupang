"use client";

import React, { useState, useEffect } from "react";
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
    opdId: "", // ✅ Tambahkan OPD ke state
  });

  const [opds, setOpds] = useState([]); // ✅ List OPD dari API
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil daftar OPD saat modal dibuka
  useEffect(() => {
    if (openModal) {
      fetchOpds();
    }
  }, [openModal]);

  const fetchOpds = async () => {
    try {
      const res = await axios.get("/api/opd/list");
      setOpds(res.data);
    } catch (error) {
      console.error("Gagal mengambil OPD:", error);
      toast.error("Gagal mengambil daftar OPD.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`/api/reports`, {
        ...formData,
        opdId: Number(formData.opdId), // ✅ konversi ke number!
        userId: user.id,
      });

      toast.success("Laporan berhasil dikirim!");

      setFormData({
        title: "",
        category: "",
        priority: "LOW",
        description: "",
        status: "PENDING",
        opdId: "",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);

      setOpenModal(false);
    } catch (error) {
      toast.error("Gagal mengirim laporan.");
      console.error(error);
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
          </div>

          {/* Kategori */}
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
          </div>

          {/* Prioritas */}
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

          {/* OPD Tujuan */}
          <div>
            <Label htmlFor="opdId">
              OPD Tujuan <span className="text-red-500">*</span>
            </Label>
            <Select
              id="opdId"
              name="opdId"
              value={formData.opdId}
              onChange={handleChange}
              required
            >
              <option value="">Pilih OPD</option>
              {opds.map((opd) => (
                <option key={opd.opdId} value={opd.opdId}>
                  {opd.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Deskripsi */}
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

          {/* Tombol Submit */}
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
