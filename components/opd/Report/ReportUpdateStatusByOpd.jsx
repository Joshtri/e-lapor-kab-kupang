"use client";

import React, { useState } from "react";
import { Modal, Button, Select } from "flowbite-react";
import axios from "axios";
import { toast } from "sonner";

const UpdateStatusModalByOpd = ({ open, setOpen, report }) => {
  const [opdStatus, setOpdStatus] = useState(report.opdStatus || "PENDING"); // ✅ ganti nama state
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/reports/${report.id}/opd-status`, {
        opdStatus, // ✅ sesuai field backend
      });
      toast.success("Status laporan diperbarui!");
      setOpen(false);
    } catch (error) {
      toast.error("Gagal memperbarui status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="md">
      <Modal.Header>Ubah Status Laporan by OPD</Modal.Header>
      <Modal.Body>
        <Select value={opdStatus} onChange={(e) => setOpdStatus(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="PROSES">Sedang Diproses</option>
          <option value="SELESAI">Selesai</option>
          <option value="DITOLAK">Ditolak</option> {/* ✅ ini tadinya salah */}
        </Select>
      </Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={handleUpdateStatus} disabled={isLoading}>
          {isLoading ? "Memproses..." : "Simpan"}
        </Button>
        <Button color="gray" onClick={() => setOpen(false)}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStatusModalByOpd;
