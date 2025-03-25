"use client";

import { Select, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function InlineOPDSelector({ report, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [opds, setOpds] = useState([]);
  const [value, setValue] = useState(report.opd?.name ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) fetchOpds();
  }, [editing]);

  const fetchOpds = async () => {
    try {
      const { data } = await axios.get("/api/opd/list");
      setOpds(data);
    } catch {
      toast.error("Gagal memuat daftar OPD");
    }
  };

  const save = async () => {
    if (!value) return toast.error("Pilih OPD terlebih dahulu");
    setSaving(true);

    try {
      const selected = opds.find(o => o.name === value);
      await axios.patch("/api/reports/admin/update-opd", {
        reportId: report.id,
        opdId: selected.id,
      });
      toast.success("OPD berhasil diperbarui");
      onUpdated();
      setEditing(false);
    } catch {
      // toast.error("Gagal memperbarui OPD");
    } finally {
      setSaving(false);
    }
  };

  return editing ? (
    <div className="flex items-center space-x-2">
      <Select
        size="xs"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="min-w-[140px] text-sm"
        disabled={saving}
      >
        <option value="">— pilih OPD —</option>
        {opds.map(o => (
          <option key={o.id} value={o.name}>
            {o.name}
          </option>
        ))}
      </Select>
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
