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
import { 
  HiOutlineMail, 
  HiPaperAirplane, 
  HiOfficeBuilding,
  HiExclamation,
  HiTag,
  HiFlag
} from "react-icons/hi";

const ReportModal = ({ openModal, setOpenModal, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "LOW",
    description: "",
    status: "PENDING",
    opdId: "",
  });

  const [opds, setOpds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        opdId: Number(formData.opdId),
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

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1500);
      onSuccess?.();

      setOpenModal(false);
    } catch (error) {
      toast.error("Gagal mengirim laporan.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "red";
      case "MEDIUM": return "yellow";
      case "LOW": return "blue";
      default: return "blue";
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="2xl">
      <Modal.Header className="border-b-4 border-blue-500">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <HiOutlineMail className="text-blue-600 h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">Buat Laporan Baru</span>
        </div>
      </Modal.Header>
      
      <Modal.Body>
        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <HiExclamation className="text-blue-600 h-5 w-5" />
            </div>
            <p className="text-sm text-blue-800">
              Silakan isi formulir di bawah ini dengan lengkap dan jelas. Laporan Anda akan diteruskan ke OPD terkait dan Bupati.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Judul Laporan */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center text-gray-700">
              <HiTag className="mr-2 h-4 w-4 text-blue-600" />
              Judul Laporan <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="title"
              name="title"
              placeholder="Masukkan judul laporan..."
              value={formData.title}
              onChange={handleChange}
              required
              className="border-gray-300"
            />
            <p className="text-xs text-gray-500">
              Berikan judul yang singkat dan jelas tentang laporan Anda
            </p>
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center text-gray-700">
              <HiTag className="mr-2 h-4 w-4 text-blue-600" />
              Kategori Laporan <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border-gray-300"
            >
              <option value="">Pilih Kategori</option>
              <option value="INFRASTRUKTUR">Infrastruktur</option>
              <option value="PELAYANAN">Pelayanan Publik</option>
              <option value="SOSIAL">Permasalahan Sosial</option>
              <option value="LAINNYA">Lainnya</option>
            </Select>
          </div>

          {/* Prioritas */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="flex items-center text-gray-700">
              <HiFlag className="mr-2 h-4 w-4 text-blue-600" />
              Prioritas <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="border-gray-300"
            >
              <option value="LOW">Rendah</option>
              <option value="MEDIUM">Sedang</option>
              <option value="HIGH">Tinggi</option>
            </Select>
            <div className="flex items-center mt-1">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: `var(--flowbite-${getPriorityColor(formData.priority)}-500)` }}
              ></div>
              <p className="text-xs text-gray-500">
                {formData.priority === "HIGH" 
                  ? "Memerlukan penanganan segera" 
                  : formData.priority === "MEDIUM" 
                    ? "Penanganan dalam waktu dekat" 
                    : "Penanganan sesuai antrian"}
              </p>
            </div>
          </div>

          {/* OPD Tujuan */}
          <div className="space-y-2">
            <Label htmlFor="opdId" className="flex items-center text-gray-700">
              <HiOfficeBuilding className="mr-2 h-4 w-4 text-blue-600" />
              OPD Tujuan <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              id="opdId"
              name="opdId"
              value={formData.opdId}
              onChange={handleChange}
              required
              className="border-gray-300"
            >
              <option value="">Pilih OPD</option>
              {opds.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.name} {opd.id}
                </option>
              ))}
            </Select>
            <p className="text-xs text-gray-500">
              Pilih instansi yang sesuai dengan laporan Anda
            </p>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center text-gray-700">
              <HiOutlineMail className="mr-2 h-4 w-4 text-blue-600" />
              Deskripsi Laporan <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Jelaskan permasalahan yang Anda alami secara detail..."
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
              className="border-gray-300"
            />
            <p className="text-xs text-gray-500">
              Berikan informasi selengkap mungkin termasuk lokasi, waktu kejadian, dan detail lainnya
            </p>
          </div>
        </form>
      </Modal.Body>
      
      <Modal.Footer className="flex justify-between">
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Batal
        </Button>
        <Button 
          color="blue" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="flex items-center"
        >
          <HiPaperAirplane className="mr-2 h-4 w-4" />
          {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportModal;