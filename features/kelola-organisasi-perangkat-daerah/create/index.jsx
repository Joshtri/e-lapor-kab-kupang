'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TextInput, Button, Label, Select, Card } from 'flowbite-react';
import PageHeader from '@/components/ui/PageHeader';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import {
  fetchAvailableOpdUsers,
  createOpdWithStaff,
} from '@/services/opdService';

export default function OPDCreateForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      staffUserId: '',
      name: '',
      alamat: '',
      email: '',
      telp: '',
      website: '',
    },
  });

  // Fetch available users
  const { data: availableUsers = [], isLoading: loading } = useQuery({
    queryKey: ['available-opd-users'],
    queryFn: fetchAvailableOpdUsers,
    onError: () => {
      toast.error('Gagal memuat daftar user OPD.');
    },
  });

  // Create OPD mutation
  const createOPDMutation = useMutation({
    mutationFn: createOpdWithStaff,
    onSuccess: () => {
      toast.success('✅ Data OPD berhasil ditambahkan!');

      // Invalidate OPD queries
      queryClient.invalidateQueries({ queryKey: ['opd'] });
      queryClient.invalidateQueries({ queryKey: ['available-opd-users'] });

      reset();
      router.push('/adm/org-perangkat-daerah');
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || '❌ Gagal menambahkan data OPD.',
      );
    },
  });

  const onSubmit = (data) => {
    createOPDMutation.mutate(data);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleReset = () => {
    reset();
  };

  if (loading) {
    return <LoadingScreen isLoading={loading} message="Memuat data..." />;
  }

  return (
    <>
      <LoadingScreen
        isLoading={createOPDMutation.isPending}
        message="Menyimpan data OPD..."
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <PageHeader
            title="Tambah OPD"
            backHref="/adm/org-perangkat-daerah"
            breadcrumbsProps={{
              home: { label: 'Beranda', href: '/adm/dashboard' },
              customRoutes: {
                adm: { label: 'Dashboard Admin', href: '/adm/dashboard' },
                'org-perangkat-daerah': {
                  label: 'Manajemen OPD',
                  href: '/adm/org-perangkat-daerah',
                },
                create: {
                  label: 'Tambah OPD',
                  href: '/adm/org-perangkat-daerah/create',
                },
              },
            }}
          />
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User OPD */}
            <div>
              <Label htmlFor="staffUserId" value="Pilih User OPD *" />
              <Select
                id="staffUserId"
                {...register('staffUserId', {
                  required: 'User OPD wajib dipilih',
                })}
                color={errors.staffUserId ? 'failure' : 'gray'}
                disabled={createOPDMutation.isPending}
              >
                <option value="">-- Pilih User OPD --</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Select>
              {errors.staffUserId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.staffUserId.message}
                </p>
              )}
            </div>

            {/* Nama Instansi */}
            <div>
              <Label htmlFor="name" value="Nama Instansi *" />
              <TextInput
                id="name"
                {...register('name', {
                  required: 'Nama instansi wajib diisi',
                })}
                placeholder="Contoh: Dinas Kesehatan"
                color={errors.name ? 'failure' : 'gray'}
                helperText={errors.name?.message}
                disabled={createOPDMutation.isPending}
              />
            </div>

            {/* Alamat */}
            <div>
              <Label htmlFor="alamat" value="Alamat Instansi" />
              <TextInput
                id="alamat"
                {...register('alamat')}
                placeholder="Jl. Soekarno Hatta No.1"
                disabled={createOPDMutation.isPending}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" value="Email Resmi Instansi" />
              <TextInput
                id="email"
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format email tidak valid',
                  },
                })}
                placeholder="opd@kupangkab.go.id"
                color={errors.email ? 'failure' : 'gray'}
                helperText={errors.email?.message}
                disabled={createOPDMutation.isPending}
              />
            </div>

            {/* Telepon */}
            <div>
              <Label htmlFor="telp" value="Nomor Telepon" />
              <TextInput
                id="telp"
                {...register('telp')}
                placeholder="0380-xxxxxx"
                disabled={createOPDMutation.isPending}
              />
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website" value="Website" />
              <TextInput
                id="website"
                {...register('website')}
                placeholder="https://opd.kupangkab.go.id"
                disabled={createOPDMutation.isPending}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <Button
                  type="button"
                  color="gray"
                  onClick={handleReset}
                  disabled={!isDirty || createOPDMutation.isPending}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  color="light"
                  onClick={handleCancel}
                  disabled={createOPDMutation.isPending}
                >
                  Batal
                </Button>
              </div>

              <Button
                type="submit"
                color="blue"
                disabled={!isDirty || createOPDMutation.isPending}
              >
                {createOPDMutation.isPending ? 'Menyimpan...' : 'Simpan OPD'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
