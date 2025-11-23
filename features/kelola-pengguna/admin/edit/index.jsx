'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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

// API functions
const fetchUserDetail = async (id) => {
  const { data } = await axios.get(`/api/users/${id}`);
  return data;
};

const updateAdmin = async ({ id, userData }) => {
  const { data } = await axios.patch(`/api/users/${id}`, {
    ...userData,
    role: 'ADMIN', // Fixed role
  });
  return data;
};

export default function EditAdminForm({ userId }) {
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

  // Fetch user data
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserDetail(userId),
    enabled: !!userId,
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.user) {
      const user = data.user;

      reset({
        name: user.name || '',
        nikNumber: user.nikDecrypted || '',
        contactNumber: user.contactNumber || '',
        email: user.email || '',
        password: '', // Password kosong untuk security
      });
    }
  }, [data, reset]);

  // Update admin mutation
  const updateAdminMutation = useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      toast.success('Akun Admin berhasil diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['users', 'ADMIN'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      router.push('/adm/users/admin');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal memperbarui admin.');
    },
  });

  const onSubmit = async (data) => {
    // Jika password kosong, hapus dari data
    const submitData = { ...data };
    if (!submitData.password) {
      delete submitData.password;
    }

    updateAdminMutation.mutate({ id: userId, userData: submitData });
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingScreen isLoading={true} message="Memuat data admin..." />;
  }

  return (
    <>
      <LoadingScreen
        isLoading={updateAdminMutation.isPending}
        message="Menyimpan perubahan..."
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <PageHeader
            title="Edit Akun Admin"
            description="Perbarui informasi akun administrator"
            backHref="/adm/users/admin"
            role="adm"
          />
        </div>

        <Card>
          {/* Alert Information */}
          <Alert color="warning" icon={HiInformationCircle} className="mb-6">
            <span className="font-medium">Perhatian:</span>
            <ul className="mt-2 ml-4 list-disc text-sm">
              <li>
                Biarkan field password <strong>kosong</strong> jika tidak ingin mengubah password
              </li>
              <li>
                NIK yang tersimpan sudah ter-enkripsi untuk keamanan
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
                disabled={updateAdminMutation.isPending}
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
                disabled={updateAdminMutation.isPending}
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
                disabled={updateAdminMutation.isPending}
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
                disabled={updateAdminMutation.isPending}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" value="Password (Opsional)" />
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Kosongkan jika tidak ingin ubah password"
                  {...register('password', {
                    minLength: {
                      value: 6,
                      message: 'Password minimal 6 karakter',
                    },
                  })}
                  color={errors.password ? 'failure' : 'gray'}
                  helperText={errors.password?.message || 'Biarkan kosong jika tidak ingin mengubah password'}
                  disabled={updateAdminMutation.isPending}
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
              <Button
                type="button"
                color="light"
                onClick={handleCancel}
                disabled={updateAdminMutation.isPending}
              >
                Batal
              </Button>

              <Button
                type="submit"
                color="blue"
                disabled={updateAdminMutation.isPending || !isDirty}
              >
                {updateAdminMutation.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
