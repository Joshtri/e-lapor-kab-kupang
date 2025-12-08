import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, ToggleSwitch } from 'flowbite-react';

export default function CategoryModal({
  show,
  onClose,
  onSubmit,
  editingCategory = null,
  submitting = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        isActive: editingCategory.isActive,
      });
    } else {
      setFormData({
        name: '',
        isActive: true,
      });
    }
  }, [editingCategory, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({ name: '', isActive: true });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', isActive: true });
    onClose();
  };

  return (
    <Modal show={show} onClose={handleClose}>
      <Modal.Header>
        {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Kategori</Label>
            <TextInput
              id="name"
              type="text"
              placeholder="Masukkan nama kategori"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={submitting}
            />
          </div>
          <div>
            <ToggleSwitch
              checked={formData.isActive}
              label="Status Aktif"
              onChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
              disabled={submitting}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button color="gray" onClick={handleClose} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
