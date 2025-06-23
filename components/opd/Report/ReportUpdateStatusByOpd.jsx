'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Label, Textarea } from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';

const UpdateStatusModalByOpd = ({ open, setOpen, report }) => {
  const [opdStatus, setOpdStatus] = useState('PENDING');
  const [opdReason, setOpdReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset status setiap kali modal dibuka
  useEffect(() => {
    if (open && report) {
      setOpdStatus(report.opdStatus || 'PENDING');
      setOpdReason(report.opdReason || '');
    }
  }, [open, report]);

  const handleUpdateStatus = async () => {
    if (isLoading) return; // ⛔ Hindari double submit
    
    // Validasi alasan penolakan
    if (opdStatus === 'DITOLAK' && !opdReason.trim()) {
      toast.error('Harap berikan alasan penolakan');
      return;
    }

    setIsLoading(true);
    try {
      await axios.patch(`/api/reports/${report.id}/opd-status`, {
        opdStatus,
        opdReason: opdStatus === 'DITOLAK' ? opdReason : null,
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
      <Modal.Body className="space-y-4">
        <div>
          <Label htmlFor="opdStatus" value="Status Laporan" className="mb-2 block" />
          <Select
            id="opdStatus"
            value={opdStatus}
            onChange={(e) => setOpdStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="PROSES">Sedang Diproses</option>
            <option value="SELESAI">Selesai</option>
            <option value="DITOLAK">Ditolak</option>
          </Select>
        </div>

        {opdStatus === 'DITOLAK' && (
          <div>
            <Label htmlFor="opdReason" value="Alasan Penolakan *" className="mb-2 block" />
            <Textarea
              id="opdReason"
              value={opdReason}
              onChange={(e) => setOpdReason(e.target.value)}
              placeholder="Berikan alasan mengapa laporan ini ditolak"
              required
              rows={4}
            />
          </div>
        )}
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