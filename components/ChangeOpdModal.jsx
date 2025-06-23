'use client';

import { Button, Label, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
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
  const [currentOpdName, setCurrentOpdName] = useState('');

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

      // Find current OPD name for logging purposes
      if (currentOpdId) {
        const currentOpd = data.find((opd) => opd.id === Number(currentOpdId));
        if (currentOpd) {
          setCurrentOpdName(currentOpd.name);
        }
      }
    } catch (error) {
      console.error('Gagal memuat daftar OPD:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedOpdId)
      return toast.error('Silakan pilih OPD terlebih dahulu.');

    if (Number(selectedOpdId) === currentOpdId) {
      return toast.info('OPD yang dipilih sama dengan OPD saat ini.');
    }

    setLoading(true);
    try {
      const selectedOpd = opds.find((opd) => opd.id === Number(selectedOpdId));
      const selectedOpdName = selectedOpd ? selectedOpd.name : 'Unknown';

      const res = await fetch(`/api/reports/${reportId}/opd-terkait-notify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opdId: Number(selectedOpdId),
          previousOpdId: currentOpdId,
          previousOpdName: currentOpdName,
          newOpdName: selectedOpdName,
        }),
      });

      if (!res.ok) throw new Error('Gagal memperbarui laporan');
      toast.success('OPD berhasil diperbarui.');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
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
          {currentOpdId && (
            <div className="text-sm bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="font-medium text-blue-700">OPD Saat Ini:</p>
              <p className="text-blue-600">
                {currentOpdName || 'Tidak diketahui'}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="opd">Pilih OPD Baru</Label>
            <ReactSelect
              inputId="opd"
              className="text-sm"
              value={opds.find((opd) => opd.id === Number(selectedOpdId))}
              onChange={(selected) =>
                setSelectedOpdId(selected?.id?.toString() || '')
              }
              options={opds}
              getOptionLabel={(opd) => opd.name}
              getOptionValue={(opd) => opd.id.toString()}
              placeholder="-- Pilih OPD --"
              isClearable
              menuPortalTarget={document.body} // ⬅️ penting
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }), // ⬅️ penting
              }}
            />
          </div>

          <div className="text-xs text-gray-500 italic mt-2">
            Perubahan OPD akan tercatat dalam riwayat laporan.
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdate} isProcessing={loading}>
          Simpan Perubahan
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeOpdModal;
