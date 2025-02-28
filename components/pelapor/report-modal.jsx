"use client";

import React, { useState } from "react";
import { Modal, Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import axios from "axios";
import { toast } from "sonner";

const ReportModal = ({ openModal, setOpenModal, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "normal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/reports", { ...formData, userId: user.id });
      toast.success("Laporan berhasil dibuat!");
      setFormData({ title: "", description: "", priority: "normal" });
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
          <Label htmlFor="title" value="Judul Laporan" />
          <TextInput id="title" name="title" placeholder="Masukkan judul" value={formData.title} onChange={handleChange} required />
          <Label htmlFor="description" value="Deskripsi" />
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          <Button type="submit" color="blue" disabled={isSubmitting}>{isSubmitting ? "Mengirim..." : "Kirim Laporan"}</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
