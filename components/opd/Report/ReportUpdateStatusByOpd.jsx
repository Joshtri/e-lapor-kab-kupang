'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Select } from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';

const UpdateStatusModalByOpd = ({ open, setOpen, report }) => {
  const [opdStatus, setOpdStatus] = useState('PENDING');
  const [isLoading, setIsLoading] = useState(false);

  // Reset status setiap kali modal dibuka
  useEffect(() => {
    if (open && report) {
      setOpdStatus(report.opdStatus || 'PENDING');
    }
  }, [open, report]);

  const handleUpdateStatus = async () => {
    if (isLoading) return; // ⛔ Hindari double submit

    setIsLoading(true);
    try {
      await axios.patch(`/api/reports/${report.id}/opd-status`, {
        opdStatus,
      });

      toast.dismiss(); // ✅ Tutup semua toast sebelumnya
      toast.success('Status laporan diperbarui!');

      setOpen(false);
    } catch (error) {
      toast.dismiss(); // ✅ Hindari duplikat toast
      toast.error('Gagal memperbarui status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="md">
      <Modal.Header>Ubah Status Laporan oleh OPD</Modal.Header>
      <Modal.Body>
        <Select
          value={opdStatus}
          onChange={(e) => setOpdStatus(e.target.value)}
        >
          <option value="PENDING">Pending</option>
          <option value="PROSES">Sedang Diproses</option>
          <option value="SELESAI">Selesai</option>
          <option value="DITOLAK">Ditolak</option>
        </Select>
      </Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={handleUpdateStatus} disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Simpan'}
        </Button>
        <Button
          color="gray"
          onClick={() => setOpen(false)}
          disabled={isLoading}
        >
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStatusModalByOpd;
