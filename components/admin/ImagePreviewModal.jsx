'use client';

import { Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';

export default function ImagePreviewModal({ open, setOpen, reportId }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            if (!reportId) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/reports/${reportId}/image`);
                const data = await res.json();
                setImageUrl(data.image);
            } catch (err) {
                console.error('Gagal ambil gambar:', err);
                setImageUrl(null);
            } finally {
                setLoading(false);
            }
        };

        if (open) fetchImage();
    }, [open, reportId]);

    return (
        <Modal show={open} onClose={() => setOpen(false)}>
            <Modal.Header>Gambar Laporan</Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="space-y-4">
                        <div className="h-64 w-full bg-gray-300 animate-pulse rounded" />
                        <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded" />
                        <div className="h-4 w-1/2 bg-gray-300 animate-pulse rounded" />
                    </div>
                ) : imageUrl ? (
                    <img src={imageUrl} alt="Gambar Laporan" className="rounded w-full" />
                ) : (
                    <p className="text-gray-500 text-center">Gambar tidak tersedia.</p>
                )}
            </Modal.Body>
        </Modal>
    );
}
