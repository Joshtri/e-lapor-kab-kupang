'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Select } from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['PENDING', 'PROSES', 'SELESAI', 'DITOLAK'];

export default function UpdateStatusModal({
  open,
  setOpen,
  report,
  onSuccess,
}) {
  const [bupatiStatus, setBupatiStatus] = useState('');
  const [opdStatus, setOpdStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setBupatiStatus(report.bupatiStatus || 'PENDING');
      setOpdStatus(report.opdStatus || 'PENDING');
    }
  }, [report]);

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/reports/${report.id}/admin-status`, {
        bupatiStatus,
        opdStatus,
      });

      toast.success('Status laporan berhasil diperbarui!');
      onSuccess?.(); // jika ada handler untuk refresh
      setOpen(false);
    } catch (error) {
      '❌ Gagal update status:', error;
      toast.error('Gagal memperbarui status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={open} size="md" onClose={() => setOpen(false)}>
      <Modal.Header>Ubah Status Laporan</Modal.Header>
      <Modal.Body className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Status Bupati
          </label>
          <Select
            value={bupatiStatus}
            onChange={(e) => setBupatiStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Status OPD
          </label>
          <Select
            value={opdStatus}
            onChange={(e) => setOpdStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button color="blue" onClick={handleUpdateStatus} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button color="gray" onClick={() => setOpen(false)} disabled={loading}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
