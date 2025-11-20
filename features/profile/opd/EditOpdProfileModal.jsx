'use client';

import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const EditOpdProfileModal = ({ open, setOpen, opd, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    alamat: '',
    email: '',
    telp: '',
    website: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (opd) {
      setFormData({
        name: opd.name || '',
        alamat: opd.alamat || '',
        email: opd.email || '',
        telp: opd.telp || '',
        website: opd.website || '',
      });
    }
  }, [opd]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.name.trim()) {
        toast.error('Nama OPD wajib diisi');
        setIsSubmitting(false);
        return;
      }

      // Email validation
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.error('Format email tidak valid');
        setIsSubmitting(false);
        return;
      }

      await onSave(formData);
      setOpen(false);
    } catch (error) {
      console.error('Error updating OPD profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)}>
      <Modal.Header>Edit Profil OPD</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" value="Nama OPD *" />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama OPD"
              required
            />
          </div>

          <div>
            <Label htmlFor="alamat" value="Alamat" />
            <TextInput
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Alamat OPD"
            />
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email OPD"
            />
          </div>

          <div>
            <Label htmlFor="telp" value="Telepon" />
            <TextInput
              id="telp"
              name="telp"
              value={formData.telp}
              onChange={handleChange}
              placeholder="Nomor Telepon OPD"
            />
          </div>

          <div>
            <Label htmlFor="website" value="Website" />
            <TextInput
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website OPD (contoh: example.com)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: example.com atau https://example.com
            </p>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button color="purple" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
        <Button color="gray" onClick={() => setOpen(false)}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditOpdProfileModal;
