'use client';

import { Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Select from 'react-select';

export default function InlineOPDSelector({ report, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [opds, setOpds] = useState([]);
  const [selectedOption, setSelectedOption] = useState(
    report.opd ? { value: report.opd.id, label: report.opd.name } : null,
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
    if (!selectedOption) return toast.error('Pilih OPD terlebih dahulu');
    setSaving(true);

    try {
      await axios.patch('/api/reports/admin/update-opd', {
        reportId: report.id,
        opdId: selectedOption.value,
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

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '32px',
      height: '32px',
      minWidth: '200px',
      fontSize: '0.875rem',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 6px',
    }),
    input: (base) => ({
      ...base,
      margin: '0',
      padding: '0',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '32px',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '4px',
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '4px',
    }),
    option: (base) => ({
      ...base,
      fontSize: '0.875rem',
      padding: '8px 12px',
    }),
  };

  return editing ? (
    <div className="flex items-center space-x-2">
      <Select
        value={selectedOption}
        onChange={setSelectedOption}
        options={opds.map((opd) => ({ value: opd.id, label: opd.name }))}
        isDisabled={saving}
        isSearchable={true}
        placeholder="Pilih OPD..."
        noOptionsMessage={() => 'Tidak ada OPD yang sesuai'}
        styles={customStyles}
        className="text-sm"
        classNamePrefix="react-select"
      />
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
