'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  TextInput,
  Label,
  Select,
  Card,
  Spinner,
} from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import PageHeader from '@/components/ui/PageHeader';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';

// API function
const createUser = async (userData) => {
  const { data } = await axios.post('/api/users', userData);
  return data;
};

export default function CreateUserForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
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

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User berhasil ditambahkan!');

      // Invalidate users query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['users'] });

      reset();
      router.push('/adm/users');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal menambahkan user.');
    },
  });

  const onSubmit = async (data) => {
    createUserMutation.mutate(data);
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
      role: '',
    });
  };

  return (
    <>
      <LoadingScreen 
        isLoading={createUserMutation.isPending} 
        message="Menyimpan user baru..."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <PageHeader title="Tambah User Baru" backHref="/adm/users" />
        </div>

        <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role */}
          <div>
            <Label htmlFor="role" value="Role *" />
            <Select
              id="role"
              {...register('role', { required: 'Role wajib dipilih' })}
              color={errors.role ? 'failure' : 'gray'}
              disabled={createUserMutation.isPending}
            >
              <option value="">Pilih Role</option>
              <option value="PELAPOR">Pelapor</option>
              <option value="ADMIN">Admin</option>
              <option value="BUPATI">Bupati</option>
              <option value="OPD">OPD</option>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Nama */}
          <div>
            <Label htmlFor="name" value="Nama Lengkap *" />
            <TextInput
              id="name"
              placeholder="Nama Lengkap"
              {...register('name', { required: 'Nama wajib diisi' })}
              color={errors.name ? 'failure' : 'gray'}
              helperText={errors.name?.message}
              disabled={createUserMutation.isPending}
            />
          </div>

          {/* NIK/NIP */}
          <div>
            <Label
              htmlFor="nikNumber"
              value={role === 'OPD' ? 'NIP (18 Digit) *' : 'NIK (16 Digit) *'}
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
              disabled={createUserMutation.isPending}
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
              disabled={createUserMutation.isPending}
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
              disabled={createUserMutation.isPending}
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" value="Password *" />
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
              disabled={createUserMutation.isPending}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-3">
              <Button
                type="button"
                color="gray"
                onClick={handleReset}
                disabled={!isDirty || createUserMutation.isPending}
              >
                Reset
              </Button>
              <Button
                type="button"
                color="light"
                onClick={handleCancel}
                disabled={createUserMutation.isPending}
              >
                Batal
              </Button>
            </div>

            <Button
              type="submit"
              color="blue"
              disabled={createUserMutation.isPending || !isDirty}
            >
              {createUserMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Menyimpan...
                </>
              ) : (
                'Simpan User'
              )}
            </Button>
          </div>
        </form>
      </Card>
      </div>
    </>
  );
}
