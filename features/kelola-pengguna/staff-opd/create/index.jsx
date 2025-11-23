'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { HiInformationCircle, HiEye, HiEyeOff } from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import SearchableSelect from '@/components/ui/inputs/SearchableSelect';
import { createStaffOpd } from '@/services/userService';
import { fetchOpds } from '@/services/opdService';

export default function CreateStaffOPDForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      nipNumber: '',
      contactNumber: '',
      email: '',
      password: '',
      opdId: '',
    },
  });

  // Query untuk mengambil daftar OPD
  const { data: opdList = [], isLoading: isLoadingOpd } = useQuery({
    queryKey: ['opds'],
    queryFn: fetchOpds,
    onError: () => {
      toast.error('Gagal memuat daftar OPD');
    },
  });

  // Create staff OPD mutation
  const createStaffMutation = useMutation({
    mutationFn: createStaffOpd,
    onSuccess: () => {
      toast.success('Staff OPD berhasil ditambahkan!');

      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ['users', 'OPD'] });
      queryClient.invalidateQueries({ queryKey: ['staff-opd'] });

      reset();
      router.push('/adm/users/staff-opd');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal menambahkan staff OPD.');
    },
  });

  const onSubmit = async (data) => {
    createStaffMutation.mutate(data);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleReset = () => {
    reset({
      name: '',
      nipNumber: '',
      contactNumber: '',
      email: '',
      password: '',
      opdId: '',
    });
  };

  return (
    <>
      <LoadingScreen
        isLoading={createStaffMutation.isPending}
        message="Menyimpan staff OPD baru..."
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <PageHeader
            title="Tambah Staff OPD Baru"
            description="Halaman ini untuk menambahkan Staff Organisasi Perangkat Daerah dengan menggunakan NIP (18 digit) dan assign ke OPD tertentu."
            backHref="/adm/users/staff-opd"
            role="adm"
          />
        </div>

        <Card>
          {/* Alert Information */}
          <Alert color="info" icon={HiInformationCircle} className="mb-6">
            <span className="font-medium">Perbedaan Penting:</span>
            <ul className="mt-2 ml-4 list-disc text-sm">
              <li>
                <strong>Staff OPD</strong> menggunakan <strong>NIP (18 digit)</strong> -
                Nomor Induk Pegawai untuk pegawai negeri sipil
              </li>
              <li>
                <strong>Pelapor/Admin/Bupati</strong> menggunakan <strong>NIK (16 digit)</strong> -
                Nomor Induk Kependudukan
              </li>
              <li>
                Staff OPD harus di-assign ke OPD tertentu atau bisa ditambahkan tanpa OPD
                (akan di-assign nanti)
              </li>
            </ul>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama */}
            <div>
              <Label htmlFor="name" value="Nama Lengkap *" />
              <TextInput
                id="name"
                placeholder="Nama Lengkap Staff OPD"
                {...register('name', { required: 'Nama wajib diisi' })}
                color={errors.name ? 'failure' : 'gray'}
                helperText={errors.name?.message}
                disabled={createStaffMutation.isPending}
              />
            </div>

            {/* NIP */}
            <div>
              <Label htmlFor="nipNumber" value="NIP (18 Digit) *" />
              <TextInput
                id="nipNumber"
                placeholder="18 digit angka NIP"
                {...register('nipNumber', {
                  required: 'NIP wajib diisi',
                  minLength: {
                    value: 18,
                    message: 'NIP harus 18 digit',
                  },
                  maxLength: {
                    value: 18,
                    message: 'NIP tidak boleh lebih dari 18 digit',
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: 'NIP hanya boleh berisi angka',
                  },
                })}
                maxLength={18}
                inputMode="numeric"
                color={errors.nipNumber ? 'failure' : 'gray'}
                helperText={errors.nipNumber?.message || 'NIP untuk pegawai negeri sipil (18 digit)'}
                disabled={createStaffMutation.isPending}
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
                disabled={createStaffMutation.isPending}
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
                disabled={createStaffMutation.isPending}
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
                  disabled={createStaffMutation.isPending}
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

            {/* OPD Assignment */}
            <div>
              <Controller
                name="opdId"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    id="opdId"
                    label="Assign ke OPD"
                    options={[
                      { label: 'Belum di-assign (bisa di-assign nanti)', value: '' },
                      ...opdList.map((opd) => ({
                        label: opd.name,
                        value: opd.id,
                      })),
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Cari OPD..."
                    isLoading={isLoadingOpd}
                    disabled={createStaffMutation.isPending}
                    error={errors.opdId?.message}
                  />
                )}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Opsional: Staff dapat di-assign ke OPD sekarang atau nanti melalui menu edit
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <Button
                  type="button"
                  color="gray"
                  onClick={handleReset}
                  disabled={!isDirty || createStaffMutation.isPending}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  color="light"
                  onClick={handleCancel}
                  disabled={createStaffMutation.isPending}
                >
                  Batal
                </Button>
              </div>

              <Button
                type="submit"
                color="blue"
                disabled={createStaffMutation.isPending || !isDirty}
              >
                {createStaffMutation.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Staff OPD'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
