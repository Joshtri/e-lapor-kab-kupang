'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Select, Label, Textarea } from 'flowbite-react';
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
  const [bupatiReason, setBupatiReason] = useState('');
  const [opdReason, setOpdReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setBupatiStatus(report.bupatiStatus || 'PENDING');
      setOpdStatus(report.opdStatus || 'PENDING');
      setBupatiReason(report.bupatiReason || '');
      setOpdReason(report.opdReason || '');
    }
  }, [report]);

  const handleUpdateStatus = async () => {
    // Validasi alasan penolakan
    if (bupatiStatus === 'DITOLAK' && !bupatiReason.trim()) {
      toast.error('Harap berikan alasan penolakan oleh Bupati');
      return;
    }

    if (opdStatus === 'DITOLAK' && !opdReason.trim()) {
      toast.error('Harap berikan alasan penolakan oleh OPD');
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`/api/reports/${report.id}/admin-status`, {
        bupatiStatus,
        opdStatus,
        bupatiReason: bupatiStatus === 'DITOLAK' ? bupatiReason : null,
        opdReason: opdStatus === 'DITOLAK' ? opdReason : null,
      });

      toast.success('Status laporan berhasil diperbarui!');
      onSuccess?.(); // jika ada handler untuk refresh
      setOpen(false);
    } catch (error) {
      console.error('❌ Gagal update status:', error);
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
          <Label
            htmlFor="bupatiStatus"
            value="Status Bupati"
            className="mb-2 block"
          />
          <Select
            id="bupatiStatus"
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

        {bupatiStatus === 'DITOLAK' && (
          <div>
            <Label
              htmlFor="bupatiReason"
              value="Alasan Penolakan Bupati *"
              className="mb-2 block"
            />
            <Textarea
              id="bupatiReason"
              value={bupatiReason}
              onChange={(e) => setBupatiReason(e.target.value)}
              placeholder="Berikan alasan mengapa laporan ini ditolak oleh Bupati"
              required
              rows={3}
            />
          </div>
        )}

        <div>
          <Label
            htmlFor="opdStatus"
            value="Status OPD"
            className="mb-2 block"
          />
          <Select
            id="opdStatus"
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

        {opdStatus === 'DITOLAK' && (
          <div>
            <Label
              htmlFor="opdReason"
              value="Alasan Penolakan OPD *"
              className="mb-2 block"
            />
            <Textarea
              id="opdReason"
              value={opdReason}
              onChange={(e) => setOpdReason(e.target.value)}
              placeholder="Berikan alasan mengapa laporan ini ditolak oleh OPD"
              required
              rows={3}
            />
          </div>
        )}
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
