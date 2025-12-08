import { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Label,
  TextInput,
  Select,
  ToggleSwitch,
} from 'flowbite-react';

export default function SubcategoryFormModal({
  show,
  onClose,
  onSubmit,
  editingSubcategory = null,
  categories = [],
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
    } else {
      setFormData({
        categoryId: '',
        name: '',
        isActive: true,
      });
    }
  }, [editingSubcategory, show]);

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
            <Label htmlFor="categoryId">Kategori</Label>
            <Select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
              disabled={submitting}
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="name">Nama Subkategori</Label>
            <TextInput
              id="name"
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Subkategori yang nonaktif tidak akan muncul di form pengaduan
            </p>
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
