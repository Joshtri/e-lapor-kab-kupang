'use client';

import { useEffect, useState } from 'react';
import { Modal, Button, Label, Select } from 'flowbite-react';
import { toast } from 'sonner';

const ChangeOpdModal = ({
  show,
  onClose,
  reportId,
  currentOpdId,
  onSuccess,
}) => {
  const [opds, setOpds] = useState([]);
  const [selectedOpdId, setSelectedOpdId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchOpdList();
      setSelectedOpdId(String(currentOpdId || '')); // 🟢 isi dengan OPD aktif jika ada
    }
  }, [show, currentOpdId]);

  const fetchOpdList = async () => {
    try {
      const res = await fetch('/api/opd');
      const data = await res.json();
      setOpds(data);
    } catch (error) {
      'Gagal memuat daftar OPD:', error;
    }
  };

  const handleUpdate = async () => {
    if (!selectedOpdId)
      return toast.error('Silakan pilih OPD terlebih dahulu.');

    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/opd-terkait-notify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opdId: Number(selectedOpdId) }),
      });

      if (!res.ok) throw new Error('Gagal memperbarui laporan');
      toast.success('OPD berhasil diperbarui.');
      onSuccess?.();
      onClose();
    } catch (err) {
      err;
      toast.error('Terjadi kesalahan saat mengupdate OPD.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Ubah OPD Tujuan</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="opd">Pilih OPD</Label>
            <Select
              id="opd"
              value={selectedOpdId}
              onChange={(e) => setSelectedOpdId(e.target.value)}
              required
            >
              <option value="">-- Pilih OPD --</option>
              {opds.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdate} isProcessing={loading}>
          Simpan
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeOpdModal;
