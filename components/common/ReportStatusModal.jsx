'use client';

import { useEffect, useState } from 'react';
import { Modal, Button, Select, Label, Textarea } from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['PENDING', 'PROSES', 'SELESAI', 'DITOLAK'];

/**
 * @param {'ADMIN' | 'OPD' | 'BUPATI'} role
 */
export default function ReportStatusModal({
  open,
  setOpen,
  report,
  role = 'ADMIN', // default
  onSuccess,
}) {
  const [bupatiStatus, setBupatiStatus] = useState('PENDING');
  const [opdStatus, setOpdStatus] = useState('PENDING');
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

  const handleSubmit = async () => {
    // Validasi alasan penolakan
    if (role === 'ADMIN' || role === 'BUPATI') {
      if (bupatiStatus === 'DITOLAK' && !bupatiReason.trim()) {
        toast.error('Harap berikan alasan penolakan oleh Bupati');
        return;
      }
    }

    if (role === 'ADMIN' || role === 'OPD') {
      if (opdStatus === 'DITOLAK' && !opdReason.trim()) {
        toast.error('Harap berikan alasan penolakan oleh OPD');
        return;
      }
    }

    setLoading(true);
    try {
      if (role === 'ADMIN') {
        await axios.patch(`/api/reports/${report.id}/admin-status`, {
          bupatiStatus,
          opdStatus,
          bupatiReason: bupatiStatus === 'DITOLAK' ? bupatiReason : null,
          opdReason: opdStatus === 'DITOLAK' ? opdReason : null,
        });
      } else if (role === 'BUPATI') {
        await axios.patch(`/api/reports/${report.id}/status`, {
          bupatiStatus,
          bupatiReason: bupatiStatus === 'DITOLAK' ? bupatiReason : null,
        });
      } else if (role === 'OPD') {
        await axios.patch(`/api/reports/${report.id}/opd-status`, {
          opdStatus,
          opdReason: opdStatus === 'DITOLAK' ? opdReason : null,
        });
      }

      toast.success('Status laporan diperbarui!');
      onSuccess?.();
      setOpen(false);
    } catch (err) {
      toast.error('Gagal memperbarui status');
    } finally {
      setLoading(false);
    }
  };

  const renderSelects = () => {
    if (role === 'ADMIN') {
      return (
        <>
          <div>
            <Label
              htmlFor="bupatiStatus"
              value="Status Bupati"
              className="mb-1 block"
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
                className="mb-1 block"
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
              className="mb-1 block"
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
                className="mb-1 block"
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
        </>
      );
    }

    if (role === 'BUPATI') {
      return (
        <>
          <div>
            <Label
              htmlFor="bupatiStatus"
              value="Status Bupati"
              className="mb-1 block"
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
                value="Alasan Penolakan *"
                className="mb-1 block"
              />
              <Textarea
                id="bupatiReason"
                value={bupatiReason}
                onChange={(e) => setBupatiReason(e.target.value)}
                placeholder="Berikan alasan mengapa laporan ini ditolak"
                required
                rows={3}
              />
            </div>
          )}
        </>
      );
    }

    if (role === 'OPD') {
      return (
        <>
          <div>
            <Label
              htmlFor="opdStatus"
              value="Status OPD"
              className="mb-1 block"
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
                value="Alasan Penolakan *"
                className="mb-1 block"
              />
              <Textarea
                id="opdReason"
                value={opdReason}
                onChange={(e) => setOpdReason(e.target.value)}
                placeholder="Berikan alasan mengapa laporan ini ditolak"
                required
                rows={3}
              />
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <Modal show={open} size="md" onClose={() => setOpen(false)}>
      <Modal.Header>Ubah Status Laporan</Modal.Header>
      <Modal.Body className="space-y-4">{renderSelects()}</Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button color="blue" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button color="gray" onClick={() => setOpen(false)} disabled={loading}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
