'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Button,
  TextInput,
  Label,
  Card,
  Spinner,
  Alert,
} from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import { HiInformationCircle, HiEye, HiEyeOff } from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';

// API function
const createAdmin = async (userData) => {
  const { data } = await axios.post('/api/users', {
    ...userData,
    role: 'ADMIN', // Fixed role
  });
  return data;
};

export default function CreateAdminForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      nikNumber: '',
      contactNumber: '',
      email: '',
      password: '',
    },
  });

  // Create admin mutation
  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.success('Akun Admin berhasil ditambahkan!');
      queryClient.invalidateQueries({ queryKey: ['users', 'ADMIN'] });
      reset();
      router.push('/adm/users/admin');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal menambahkan admin.');
    },
  });

  const onSubmit = async (data) => {
    createAdminMutation.mutate(data);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleReset = () => {
    reset({
      name: '',
      nikNumber: '',
      contactNumber: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <LoadingScreen
        isLoading={createAdminMutation.isPending}
        message="Menyimpan akun admin..."
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <PageHeader
            title="Tambah Akun Admin"
            description="Tambahkan akun administrator sistem e-Lapor"
            backHref="/adm/users/admin"
            role="adm"
          />
        </div>

        <Card>
          {/* Alert Information */}
          <Alert color="info" icon={HiInformationCircle} className="mb-6">
            <span className="font-medium">Informasi Penting:</span>
            <ul className="mt-2 ml-4 list-disc text-sm">
              <li>
                Akun Admin menggunakan <strong>NIK (16 digit)</strong> - Nomor Induk Kependudukan
              </li>
              <li>
                Admin memiliki akses penuh untuk mengelola sistem e-Lapor
              </li>
            </ul>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama */}
            <div>
              <Label htmlFor="name" value="Nama Lengkap *" />
              <TextInput
                id="name"
                placeholder="Nama Lengkap"
                {...register('name', { required: 'Nama wajib diisi' })}
                color={errors.name ? 'failure' : 'gray'}
                helperText={errors.name?.message}
                disabled={createAdminMutation.isPending}
              />
            </div>

            {/* NIK */}
            <div>
              <Label htmlFor="nikNumber" value="NIK (16 Digit) *" />
              <TextInput
                id="nikNumber"
                placeholder="16 digit angka"
                {...register('nikNumber', {
                  required: 'NIK wajib diisi',
                  minLength: {
                    value: 16,
                    message: 'NIK harus 16 digit',
                  },
                  maxLength: {
                    value: 16,
                    message: 'NIK tidak boleh lebih dari 16 digit',
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: 'NIK hanya boleh berisi angka',
                  },
                })}
                maxLength={16}
                inputMode="numeric"
                color={errors.nikNumber ? 'failure' : 'gray'}
                helperText={errors.nikNumber?.message}
                disabled={createAdminMutation.isPending}
              />
            </div>

            {/* Kontak */}
            <div>
              <Label htmlFor="contactNumber" value="No. Kontak *" />
              <TextInput
                id="contactNumber"
                placeholder="08123456789"
                {...register('contactNumber', {
                  required: 'Kontak wajib diisi',
                  maxLength: {
                    value: 15,
                    message: 'Kontak maksimal 15 digit',
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: 'Nomor kontak hanya boleh berisi angka',
                  },
                })}
                color={errors.contactNumber ? 'failure' : 'gray'}
                helperText={errors.contactNumber?.message}
                disabled={createAdminMutation.isPending}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" value="Email *" />
              <TextInput
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register('email', {
                  required: 'Email wajib diisi',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format email tidak valid',
                  },
                })}
                color={errors.email ? 'failure' : 'gray'}
                helperText={errors.email?.message}
                disabled={createAdminMutation.isPending}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" value="Password *" />
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
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
                  disabled={createAdminMutation.isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <Button
                  type="button"
                  color="gray"
                  onClick={handleReset}
                  disabled={!isDirty || createAdminMutation.isPending}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  color="light"
                  onClick={handleCancel}
                  disabled={createAdminMutation.isPending}
                >
                  Batal
                </Button>
              </div>

              <Button
                type="submit"
                color="blue"
                disabled={createAdminMutation.isPending || !isDirty}
              >
                {createAdminMutation.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Admin'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
