import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, ToggleSwitch } from 'flowbite-react';

export default function SubcategoryModal({
  show,
  onClose,
  onSubmit,
  editingSubcategory = null,
  categoryId = null,
  submitting = false,
}) {
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    isActive: true,
  });

  useEffect(() => {
    if (editingSubcategory) {
      setFormData({
        categoryId: editingSubcategory.categoryId,
        name: editingSubcategory.name,
        isActive: editingSubcategory.isActive,
      });
    } else if (categoryId) {
      setFormData({
        categoryId,
        name: '',
        isActive: true,
      });
    } else {
      setFormData({
        categoryId: '',
        name: '',
        isActive: true,
      });
    }
  }, [editingSubcategory, categoryId, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({ categoryId: '', name: '', isActive: true });
    }
  };

  const handleClose = () => {
    setFormData({ categoryId: '', name: '', isActive: true });
    onClose();
  };

  return (
    <Modal show={show} onClose={handleClose}>
      <Modal.Header>
        {editingSubcategory ? 'Edit Subkategori' : 'Tambah Subkategori'}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subname">Nama Subkategori</Label>
            <TextInput
              id="subname"
              type="text"
              placeholder="Masukkan nama subkategori"
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
