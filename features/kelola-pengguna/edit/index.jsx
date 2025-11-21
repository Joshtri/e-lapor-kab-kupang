'use client';

import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Label,
  Card,
  Select,
  TextInput,
  Spinner,
} from 'flowbite-react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MaskedNikInput from '@/components/ui/inputs/MaskedNikInput';
import ResetButton from '@/components/ui/ResetButton';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import PageHeader from '@/components/ui/PageHeader';

// API functions
const fetchUser = async (userId) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data.user;
};

const updateUser = async ({ userId, userData }) => {
  const { data } = await axios.patch(`/api/users/${userId}`, userData);
  return data;
};

const UserEdit = () => {
  const { id: userId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [nikDisplay, setNikDisplay] = useState('');
  const [identitasType, setIdentitasType] = useState('NIK');

  // Fetch user data
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('User berhasil diperbarui!');

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });

      router.push('/users');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal memperbarui user.');
    },
  });

  // Reset form when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        nikNumber: user.nikNumber || '',
        role: user.role || '',
      });
      setNikDisplay(user.nikMasked || '');
      setIdentitasType(user.identitasType || 'NIK');
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!userId) return;

    updateUserMutation.mutate({
      userId,
      userData: {
        ...data,
        identitasType,
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} message="Memuat data user..." />;
  }

  return (
    <>
      <LoadingScreen 
        isLoading={updateUserMutation.isPending} 
        message="Menyimpan perubahan..."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <PageHeader title="Edit User" backHref="/adm/users" />
        </div>

        <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nama Lengkap */}
          <div>
            <Label htmlFor="name" value="Nama Lengkap *" />
            <TextInput
              id="name"
              {...register('name', { required: 'Nama lengkap wajib diisi' })}
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" value="Email *" />
            <TextInput
              id="email"
              type="email"
              {...register('email', {
                required: 'Email wajib diisi',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Format email tidak valid',
                },
              })}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Nomor Telepon */}
          <div>
            <Label htmlFor="contactNumber" value="Nomor Telepon" />
            <TextInput
              id="contactNumber"
              {...register('contactNumber')}
              placeholder="081234567890"
            />
          </div>

          {/* Tipe Identitas */}
          <div>
            <Label htmlFor="tipe" value="Tipe Identitas" />
            <Select
              id="tipe"
              value={identitasType}
              onChange={(e) => setIdentitasType(e.target.value)}
              disabled={updateUserMutation.isPending}
            >
              <option value="NIK">NIK (16 digit)</option>
              <option value="NIP">NIP (18 digit)</option>
            </Select>
          </div>

          {/* NIK/NIP Input */}
          <div>
            <Label
              htmlFor="nikNumber"
              value={`${identitasType} (${identitasType === 'NIP' ? '18' : '16'} digit)`}
            />
            <MaskedNikInput
              type={identitasType}
              value={nikDisplay}
              onChange={(val) => {
                setNikDisplay(val);
                setValue('nikNumber', val, { shouldDirty: true });
              }}
              helperText={`Masukkan ${identitasType === 'NIP' ? '18' : '16'} digit ${identitasType}`}
              disabled={updateUserMutation.isPending}
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role" value="Role *" />
            <Select
              id="role"
              {...register('role', { required: 'Role wajib dipilih' })}
              disabled={updateUserMutation.isPending}
            >
              <option value="">Pilih Role</option>
              <option value="ADMIN">Admin</option>
              <option value="BUPATI">Bupati</option>
              <option value="OPD">OPD</option>
              <option value="PELAPOR">Pelapor</option>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-3">
              <ResetButton
                onReset={() => {
                  if (user) {
                    reset({
                      name: user.name || '',
                      email: user.email || '',
                      contactNumber: user.contactNumber || '',
                      nikNumber: user.nikNumber || '',
                      role: user.role || '',
                    });
                    setNikDisplay(user.nikMasked || '');
                    setIdentitasType(user.identitasType || 'NIK');
                  }
                }}
                disabled={!isDirty || updateUserMutation.isPending}
              />
              <Button
                type="button"
                color="gray"
                onClick={handleCancel}
                disabled={updateUserMutation.isPending}
              >
                Batal
              </Button>
            </div>

            <Button
              type="submit"
              color="blue"
              disabled={!isDirty || updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
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
};

export default UserEdit;
