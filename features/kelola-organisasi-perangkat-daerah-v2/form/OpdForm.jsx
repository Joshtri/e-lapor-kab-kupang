'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from 'flowbite-react';
import { HiOutlineArrowLeft } from 'react-icons/hi';

import { createOpdV2, updateOpdV2 } from '@/services/opdServiceV2';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';

// Validation schema
const opdSchema = z.object({
  name: z.string().min(3, 'Nama OPD minimal 3 karakter'),
  email: z.string().email('Email tidak valid').min(1, 'Email instansi wajib diisi'),
  telp: z.string().min(1, 'Nomor telepon instansi wajib diisi'),
  alamat: z.string().min(1, 'Alamat instansi wajib diisi'),
  website: z.string().url('URL tidak valid').or(z.literal('')).optional(),
});

export default function OpdForm({ initialData, isEdit }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(opdSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      telp: '',
      alamat: '',
      website: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        await updateOpdV2(initialData.id, data);
        toast.success('OPD berhasil diperbarui');
      } else {
        await createOpdV2(data);
        toast.success('OPD berhasil ditambahkan');
      }
      router.push('/adm/organisasi-perangkat-daerah');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Terjadi kesalahan';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <LoadingScreen isLoading={isSubmitting} />

      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <HiOutlineArrowLeft className="h-5 w-5" />
            <span>Kembali</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit OPD' : 'Tambah OPD Baru'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isEdit
              ? 'Perbarui informasi OPD'
              : 'Buat data Organisasi Perangkat Daerah baru'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nama OPD */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nama OPD <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Dinas Kesehatan"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Email Instansi <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Email kontak untuk instansi/OPD ini (bukan email staff). Email staff diatur melalui akun user masing-masing.
            </p>
            <input
              type="email"
              placeholder="Contoh: dinas-kesehatan@kupang.go.id"
              {...register('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nomor Telepon Instansi <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Nomor telepon kontak untuk instansi/OPD ini (bukan nomor HP staff). Nomor HP staff diatur melalui akun user masing-masing.
            </p>
            <input
              type="tel"
              placeholder="Contoh: (0380) 123456"
              {...register('telp')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Masukkan alamat lengkap OPD"
              {...register('alamat')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Website
            </label>
            <input
              type="url"
              placeholder="Contoh: https://dinas-kesehatan.kupang.go.id"
              {...register('website')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">
                {errors.website.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              color="light"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting}
              isProcessing={isSubmitting}
            >
              {isEdit ? 'Simpan Perubahan' : 'Tambah OPD'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
