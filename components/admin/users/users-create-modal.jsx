'use client';

import { Modal, Button, TextInput, Label, Select } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';

export default function CreateUserModal({ open, setOpen, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      nikNumber: '',
      contactNumber: '',
      email: '',
      password: '',
      role: '',
    },
  });

  const role = watch('role');

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/users', data);

      toast.success('User berhasil ditambahkan!');

      reset();
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Gagal menambahkan user.');
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="lg">
      <Modal.Header>Tambah User Baru</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role */}
          <div>
            <Label htmlFor="role" value="Role" />
            <Select id="role" {...register('role', { required: true })}>
              <option>Pilih Role</option>
              <option value="PELAPOR">Pelapor</option>
              <option value="ADMIN">Admin</option>
              <option value="BUPATI">Bupati</option>
              <option value="OPD">OPD</option>
            </Select>
          </div>

          {/* Nama */}
          <div>
            <Label htmlFor="name" value="Nama Lengkap" />
            <TextInput
              id="name"
              placeholder="Nama Lengkap"
              {...register('name', { required: 'Nama wajib diisi' })}
              color={errors.name ? 'failure' : 'gray'}
              helperText={errors.name?.message}
            />
          </div>

          {/* NIK */}
          {/* NIK */}
          {/* NIK/NIP */}
                <div>
                <Label
                  htmlFor="nikNumber"
                  value={role === 'OPD' ? 'NIP (18 Digit)' : 'NIK (16 Digit)'}
                />
                <TextInput
                  id="nikNumber"
                  placeholder={role === 'OPD' ? '18 digit angka' : '16 digit angka'}
                  {...register('nikNumber', {
                  required: `${role === 'OPD' ? 'NIP' : 'NIK'} wajib diisi`,
                  minLength: {
                    value: role === 'OPD' ? 18 : 16,
                    message: `${role === 'OPD' ? 'NIP' : 'NIK'} harus ${role === 'OPD' ? '18' : '16'} digit`,
                  },
                  maxLength: {
                    value: role === 'OPD' ? 18 : 16,
                    message: `${role === 'OPD' ? 'NIP' : 'NIK'} tidak boleh lebih dari ${role === 'OPD' ? '18' : '16'} digit`,
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: `${role === 'OPD' ? 'NIP' : 'NIK'} hanya boleh berisi angka`,
                  },
                  })}
                  maxLength={role === 'OPD' ? 18 : 16}
                  inputMode="numeric"
                  color={errors.nikNumber ? 'failure' : 'gray'}
                  helperText={errors.nikNumber?.message}
                />
                </div>

                {/* Kontak */}
          <div>
            <Label htmlFor="contactNumber" value="No. Kontak" />
            <TextInput
              id="contactNumber"
              placeholder="08123456789"
              {...register('contactNumber', {
                required: 'Kontak wajib diisi',
                maxLength: {
                  value: 15,
                  message: 'Kontak maksimal 15 digit',
                },
              })}
              color={errors.contactNumber ? 'failure' : 'gray'}
              helperText={errors.contactNumber?.message}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register('email', {
                required: 'Email wajib diisi',
              })}
              color={errors.email ? 'failure' : 'gray'}
              helperText={errors.email?.message}
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: {
                  value: 6,
                  message: 'Password minimal 6 karakter',
                },
              })}
              color={errors.password ? 'failure' : 'gray'}
              helperText={errors.password?.message}
            />
          </div>

          <div className="flex justify-end pt-2 gap-2">
            <Button type="submit" color="blue" isProcessing={isSubmitting}>
              Simpan
            </Button>
            <Button color="gray" onClick={() => setOpen(false)} type="button">
              Batal
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
