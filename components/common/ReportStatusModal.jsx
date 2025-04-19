'use client';

import { useEffect, useState } from 'react';
import { Modal, Button, Select } from 'flowbite-react';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setBupatiStatus(report.bupatiStatus || 'PENDING');
      setOpdStatus(report.opdStatus || 'PENDING');
    }
  }, [report]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (role === 'ADMIN') {
        await axios.patch(`/api/reports/${report.id}/admin-status`, {
          bupatiStatus,
          opdStatus,
        });
      } else if (role === 'BUPATI') {
        await axios.patch(`/api/reports/${report.id}/status`, {
          bupatiStatus,
        });
      } else if (role === 'OPD') {
        await axios.patch(`/api/reports/${report.id}/opd-status`, {
          opdStatus,
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
        </>
      );
    }

    if (role === 'BUPATI') {
      return (
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
      );
    }

    if (role === 'OPD') {
      return (
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
