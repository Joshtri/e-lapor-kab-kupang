'use client';

import { Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import SearchableSelect from '@/components/ui/inputs/SearchableSelect';

export default function InlineOPDSelector({ report, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [opds, setOpds] = useState([]);
  const [selectedOpdId, setSelectedOpdId] = useState(
    report.opd ? report.opd.id.toString() : '',
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) fetchOpds();
  }, [editing]);

  const fetchOpds = async () => {
    try {
      const { data } = await axios.get('/api/opd/list');
      setOpds(data);
    } catch {
      toast.error('Gagal memuat daftar OPD');
    }
  };

  const save = async () => {
    if (!selectedOpdId) return toast.error('Pilih OPD terlebih dahulu');
    setSaving(true);

    try {
      await axios.patch('/api/reports/admin/update-opd', {
        reportId: report.id,
        opdId: selectedOpdId,
      });
      toast.success('OPD berhasil diperbarui');
      onUpdated();
      setEditing(false);
    } catch (error) {
      console.error('Gagal memperbarui OPD:', error);
      toast.error('Gagal memperbarui OPD');
    } finally {
      setSaving(false);
    }
  };

  return editing ? (
    <div className="flex items-center space-x-2">
      <div className="min-w-[200px]">
        <SearchableSelect
          id="opd-selector"
          options={opds.map((opd) => ({
            label: opd.name,
            value: opd.id.toString(),
          }))}
          value={selectedOpdId}
          onChange={setSelectedOpdId}
          placeholder="Pilih OPD..."
          disabled={saving}
          clearable
        />
      </div>
      <Button size="xs" color="success" onClick={save} disabled={saving}>
        ✓
      </Button>
      <Button size="xs" color="light" onClick={() => setEditing(false)}>
        ✕
      </Button>
    </div>
  ) : (
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer px-1 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
    >
      {report.opd?.name ?? <span className="text-gray-400">— none —</span>}
    </span>
  );
}
