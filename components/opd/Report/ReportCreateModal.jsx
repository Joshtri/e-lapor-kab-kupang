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
} from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function ReportCreateModal({ openModal, setOpenModal }) {
  const [users, setUsers] = useState([]);
  const [opds, setOpds] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (openModal) {
      fetchOpds();
      fetchUsers();
    }
  }, [openModal]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      const pelaporUsers = res.data.filter((u) => u.role === 'PELAPOR');
      setUsers(pelaporUsers);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
    }
  };

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
      await axios.post('/api/reports', {
        ...data,
        userId: parseInt(data.userId),
        opdId: parseInt(data.opdId),
      });

      toast.success('Laporan berhasil dikirim!');
      reset();
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
            <Select id="category" {...register('category', { required: true })}>
              <option value="">Pilih Kategori</option>
              <option value="INFRASTRUKTUR">Infrastruktur</option>
              <option value="PELAYANAN">Pelayanan</option>
              <option value="SOSIAL">Sosial</option>
              <option value="KEAMANAN">Keamanan</option>
              <option value="LAINNYA">Lainnya</option>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">Kategori wajib diisi.</p>
            )}
          </div>

          {/* Prioritas */}
          <div>
            <Label htmlFor="priority" value="Prioritas *" />
            <Select id="priority" {...register('priority', { required: true })}>
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
