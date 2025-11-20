'use client';

import { Modal, Button, Label, FileInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function ChangeProfileModal({
  open,
  setOpen,
  userId,
  onUploaded,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  console.log('check userId', userId);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Pilih gambar terlebih dahulu');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      const res = await axios.patch(
        `/api/users/${userId}/change-profile-image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      toast.success('Foto profil berhasil diperbarui');
      onUploaded?.(res.data.imageUrl); // callback untuk update UI jika perlu
      setOpen(false);
    } catch (err) {
      toast.error('Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)}>
      <Modal.Header>Ubah Foto Profil</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="photo">Pilih Gambar</Label>
            <FileInput
              id="photo"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {previewUrl && (
            <div className="rounded-md overflow-hidden border w-32 h-32">
              <Image
                src={previewUrl}
                alt="Preview Foto"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={() => setOpen(false)}>
          Batal
        </Button>
        <Button onClick={handleUpload} isProcessing={isUploading}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ChangeProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  onUploaded: PropTypes.func,
};
