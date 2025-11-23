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
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import { HiInformationCircle, HiEye, HiEyeOff } from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import SearchableSelect from '@/components/ui/inputs/SearchableSelect';
import { fetchOpds } from '@/services/opdService';

// API functions
const fetchUserDetail = async (id) => {
  const { data } = await axios.get(`/api/users/${id}`);
  return data;
};

const updateStaffOpd = async ({ id, userData }) => {
  const { data } = await axios.patch(`/api/users/${id}`, {
    ...userData,
    role: 'OPD', // Fixed role
  });
  return data;
};

export default function EditStaffOpdForm({ userId }) {
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
        // Handle both nipDecrypted and nikDecrypted for backward compatibility
        nipNumber: user.nipDecrypted || user.nikDecrypted || '',
        contactNumber: user.contactNumber || '',
        email: user.email || '',
        password: '', // Password kosong untuk security
        opdId: user.opdId || '',
      });
    }
  }, [data, reset]);

  // Update staff OPD mutation
  const updateStaffMutation = useMutation({
    mutationFn: updateStaffOpd,
    onSuccess: () => {
      toast.success('Staff OPD berhasil diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['users', 'OPD'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['staff-opd'] });
      router.push('/adm/users/staff-opd');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal memperbarui staff OPD.');
    },
  });

  const onSubmit = async (data) => {
    // Jika password kosong, hapus dari data
    const submitData = { ...data };
    if (!submitData.password) {
      delete submitData.password;
    }

    // Jika opdId kosong string, set ke null
    if (submitData.opdId === '') {
      submitData.opdId = null;
    }

    updateStaffMutation.mutate({ id: userId, userData: submitData });
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingScreen isLoading={true} message="Memuat data staff OPD..." />;
  }

  return (
    <>
      <LoadingScreen
        isLoading={updateStaffMutation.isPending}
        message="Menyimpan perubahan..."
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <PageHeader
            title="Edit Akun Staff OPD"
            description="Perbarui informasi akun staff organisasi perangkat daerah"
            backHref="/adm/users/staff-opd"
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
                <strong>Staff OPD</strong> menggunakan <strong>NIP (18 digit)</strong> -
                Nomor Induk Pegawai
              </li>
              <li>
                NIP yang tersimpan sudah ter-enkripsi untuk keamanan
              </li>
              <li>
                Anda dapat mengubah assignment OPD atau membiarkannya kosong
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
                disabled={updateStaffMutation.isPending}
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
                disabled={updateStaffMutation.isPending}
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
                disabled={updateStaffMutation.isPending}
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
                disabled={updateStaffMutation.isPending}
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
                  disabled={updateStaffMutation.isPending}
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
                    disabled={updateStaffMutation.isPending}
                    error={errors.opdId?.message}
                  />
                )}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Opsional: Staff dapat di-assign ke OPD atau dibiarkan kosong
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                color="light"
                onClick={handleCancel}
                disabled={updateStaffMutation.isPending}
              >
                Batal
              </Button>

              <Button
                type="submit"
                color="blue"
                disabled={updateStaffMutation.isPending || !isDirty}
              >
                {updateStaffMutation.isPending ? (
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
