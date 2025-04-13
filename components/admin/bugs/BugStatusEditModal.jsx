'use client';
import { useState, useEffect } from 'react';
import { Modal, Select, Button } from 'flowbite-react';
import { toast } from 'sonner';

export default function BugStatusEditModal({ open, onClose, bug, onSave }) {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bug) {
      setStatus(bug.statusProblem);
      setPriority(bug.priorityProblem);
    }
  }, [bug]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bugs/${bug.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusProblem: status,
          priorityProblem: priority,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success('Status berhasil diperbarui');
      onSave(); // Untuk refetch data
      onClose();
    } catch (err) {
      toast.error('Gagal memperbarui status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={open} onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <h3 className="text-lg font-semibold mb-4">Ubah Status & Prioritas</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prioritas</label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </div>
          <div className="flex justify-end pt-2">
            <Button isProcessing={loading} onClick={handleSubmit} color="blue">
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
