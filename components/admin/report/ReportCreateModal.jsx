'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  FileInput,
} from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import { useUser } from '@/contexts/UserContext';
import {
  getMainCategories,
  getSubcategoriesByText,
} from '@/utils/reportCategories';

export default function ReportCreateModal({ openModal, setOpenModal }) {
  const { users } = useUser();
  const [opds, setOpds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageFile, setImageFile] = useState(null); // ✅ untuk simpan file gambar

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (openModal) fetchOpds();
  }, [openModal]);

  const fetchOpds = async () => {
    try {
      const res = await axios.get('/api/opd/list');
      setOpds(res.data);
    } catch (error) {
      toast.error('Gagal memuat daftar OPD');
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append('userId', data.userId);
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('subcategory', data.subcategory);
      formData.append('priority', data.priority);
      formData.append('opdId', data.opdId);
      formData.append('description', data.description);
      formData.append('location', data.location || '-');

      // ✅ kompres gambar jika ada
      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });

        formData.append('image', compressedFile);
      }

      await axios.post('/api/reports', formData);

      toast.success('Laporan berhasil dikirim!');
      reset();
      setImageFile(null);
      setOpenModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal mengirim laporan.');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Buat Laporan Baru</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pelapor */}
          <div>
            <Label htmlFor="userId" value="Pelapor *" />
            <Select id="userId" {...register('userId', { required: true })}>
              <option value="">Pilih Pelapor</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} - {u.email}
                </option>
              ))}
            </Select>
            {errors.userId && (
              <p className="text-sm text-red-500">Pelapor wajib diisi.</p>
            )}
          </div>

          {/* Judul */}
          <div>
            <Label htmlFor="title" value="Judul Laporan *" />
            <TextInput
              id="title"
              {...register('title', { required: true })}
              placeholder="Judul laporan"
            />
            {errors.title && (
              <p className="text-sm text-red-500">Judul wajib diisi.</p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <Label htmlFor="category" value="Kategori *" />
            <Select
              id="category"
              {...register('category', { required: true })}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Pilih Kategori</option>
              {getMainCategories().map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
              </option>
              ))}
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">Kategori wajib diisi.</p>
            )}
          </div>

          {/* Subkategori */}
          {selectedCategory && (
            <div>
              <Label htmlFor="subcategory" value="Subkategori *" />
              <Select
                id="subcategory"
                {...register('subcategory', { required: true })}
              >
                <option value="">Pilih Subkategori</option>
                {getSubcategoriesByText(selectedCategory).map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </Select>
              {errors.subcategory && (
                <p className="text-sm text-red-500">Subkategori wajib diisi.</p>
              )}
            </div>
          )}

          {/* Prioritas */}
          <div>
            <Label htmlFor="priority" value="Prioritas *" />
            <Select id="priority" {...register('priority', { required: true })}>
              <option value="">Pilih Prioritas</option>
              <option value="LOW">Rendah</option>
              <option value="MEDIUM">Sedang</option>
              <option value="HIGH">Tinggi</option>
            </Select>
          </div>

          {/* OPD Tujuan */}
          <div>
            <Label htmlFor="opdId" value="OPD Tujuan *" />
            <Select id="opdId" {...register('opdId', { required: true })}>
              <option value="">Pilih OPD</option>
              {opds.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.name}
                </option>
              ))}
            </Select>
            {errors.opdId && (
              <p className="text-sm text-red-500">OPD wajib dipilih.</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="description" value="Deskripsi *" />
            <Textarea
              id="description"
              rows={4}
              {...register('description', { required: true })}
              placeholder="Deskripsikan laporan Anda"
            />
            {errors.description && (
              <p className="text-sm text-red-500">Deskripsi wajib diisi.</p>
            )}
          </div>

          {/* Lokasi */}
          <div>
            <Label htmlFor="location" value="Lokasi" />
            <TextInput
              id="location"
              {...register('location')}
              placeholder="Contoh: Jl. Ahmad Yani, Oesapa"
            />
          </div>

          {/* ✅ Upload Gambar */}
          <div>
            <Label htmlFor="image" value="Gambar (opsional)" />
            <FileInput
              id="image"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Tombol Kirim */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
