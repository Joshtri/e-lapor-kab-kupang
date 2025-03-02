"use client";

import React, { useState } from "react";
import { Modal, Button, Select } from "flowbite-react";
import axios from "axios";
import { toast } from "sonner";

const UpdateStatusModal = ({ open, setOpen, report }) => {
  const [status, setStatus] = useState(report.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/reports/${report.id}/status`, { status });
      toast.success("Status laporan diperbarui!");
      setOpen(false);
    } catch (error) {
      toast.error("Gagal memperbarui status.");
    }
    setIsLoading(false);
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="md">
      <Modal.Header>Ubah Status Laporan</Modal.Header>
      <Modal.Body>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="PROSES">Sedang Diproses</option>
          <option value="SELESAI">Selesai</option>
          <option value="DITOLAK">Selesai</option>

        </Select>
      </Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={handleUpdateStatus} disabled={isLoading}>
          {isLoading ? "Memproses..." : "Simpan"}
        </Button>
        <Button color="gray" onClick={() => setOpen(false)}>Batal</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStatusModal;
