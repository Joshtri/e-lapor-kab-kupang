'use client';

import { Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';

export default function ImagePreviewModal({
  open,
  setOpen,
  reportId,
  type = 'report', // default tetap "report"
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !reportId) return;

    setImageUrl(null); // reset setiap buka ulang modal
    setLoading(true);

    const fetchImage = async () => {
      try {
        const endpoint =
          type === 'bug'
            ? `/api/pelapor/bug-reports/${reportId}/image`
            : `/api/reports/${reportId}/image`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);

        const data = await res.json();
        setImageUrl(data.image);
      } catch (err) {
        console.error('Gagal ambil gambar:', err.message);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [open, reportId, type]);

  return (
    <Modal show={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        Gambar {type === 'bug' ? 'Bug Report' : 'Laporan'}
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="space-y-4">
            <div className="h-64 w-full bg-gray-300 animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-gray-300 animate-pulse rounded" />
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Gambar" className="rounded w-full" />
        ) : (
          <p className="text-gray-500 text-center">Gambar tidak tersedia.</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
