'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { TextInput, Button, Label, Select, Spinner } from 'flowbite-react';
import PageHeader from '@/components/ui/PageHeader';

export default function OPDCreateForm() {
  const router = useRouter();
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const res = await axios.get('/api/opd/available-staff');
        setAvailableUsers(res.data);
      } catch (error) {
        toast.error('Gagal memuat daftar user OPD.');
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableUsers();
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/opd/create', {
        ...data,
        staffUserId: parseInt(data.staffUserId),
      });
      toast.success('✅ Data OPD berhasil ditambahkan!');
      reset();
      router.push('/adm/org-perangkat-daerah');
    } catch (error) {
      toast.error(
        error.response?.data?.error || '❌ Gagal menambahkan data OPD.',
      );
    }
  };

  return (
    <>
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <div>
          <Label htmlFor="staffUserId" value="Pilih User OPD" />
          {loading ? (
            <Spinner />
          ) : (
            <Select {...register('staffUserId', { required: true })}>
              <option value="">-- Pilih User OPD --</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Select>
          )}
        </div>

        <div>
          <Label htmlFor="name" value="Nama Instansi" />
          <TextInput
            {...register('name', { required: true })}
            placeholder="Contoh: Dinas Kesehatan"
          />
        </div>

        <div>
          <Label htmlFor="alamat" value="Alamat Instansi" />
          <TextInput
            {...register('alamat')}
            placeholder="Jl. Soekarno Hatta No.1"
          />
        </div>

        <div>
          <Label htmlFor="email" value="Email Resmi Instansi" />
          <TextInput
            {...register('email')}
            placeholder="opd@kupangkab.go.id"
            type="email"
          />
        </div>

        <div>
          <Label htmlFor="telp" value="Nomor Telepon" />
          <TextInput {...register('telp')} placeholder="0380-xxxxxx" />
        </div>

        <div>
          <Label htmlFor="website" value="Website" />
          <TextInput
            {...register('website')}
            placeholder="https://opd.kupangkab.go.id"
          />
        </div>

        <Button color="blue" type="submit" isProcessing={isSubmitting}>
          Simpan
        </Button>
      </form>
    </>
  );
}
