'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Button,
  Label,
  TextInput,
  Textarea,
  FileInput,
  Spinner,
} from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import SearchableSelect from '@/components/ui/inputs/SearchableSelect';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import {
  fetchOpdList,
  fetchPelaporUsers,
  createReport,
} from '@/services/reportService';
import {
  fetchCategories,
  fetchSubcategories,
} from '@/services/categoryService';

export default function CreateReportPage() {
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userId: '',
      title: '',
      categoryId: '',
      subcategoryId: '',
      priority: '',
      opdId: '',
      description: '',
      location: '',
    },
  });

  const categoryIdValue = watch('categoryId');

  // TanStack Query for fetching data
  const {
    data: opds = [],
    isLoading: isLoadingOpds,
    error: opdsError,
  } = useQuery({
    queryKey: ['opds'],
    queryFn: fetchOpdList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ['users', 'PELAPOR'],
    queryFn: fetchPelaporUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // ✅ NEW: Fetch categories from database
  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['categories', 'active'],
    queryFn: () => fetchCategories(true), // activeOnly = true
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesResponse?.data || [];

  // ✅ NEW: Fetch subcategories based on selected category
  const {
    data: subcategoriesResponse,
    isLoading: isLoadingSubcategories,
  } = useQuery({
    queryKey: ['subcategories', categoryIdValue],
    queryFn: () => fetchSubcategories(categoryIdValue, true), // activeOnly = true
    enabled: !!categoryIdValue, // Only fetch when category is selected
    staleTime: 5 * 60 * 1000,
  });

  const subcategories = subcategoriesResponse?.data || [];

  // Mutation for creating report
  const createReportMutation = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      toast.success('Laporan berhasil dikirim!');
      reset();
      setImageFile(null);

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports-list'] });

      router.push('/adm/kelola-pengaduan');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Gagal mengirim laporan.');
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Convert string values to appropriate types
      formData.append('userId', data.userId);
      formData.append('title', data.title);

      // ✅ NEW: Send categoryId and subcategoryId
      if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
        // Also send category name for legacy compatibility
        const selectedCategory = categories.find(
          (cat) => cat.id === data.categoryId
        );
        if (selectedCategory) {
          formData.append('category', selectedCategory.name);
        }
      }

      if (data.subcategoryId) {
        formData.append('subcategoryId', data.subcategoryId);
        // Also send subcategory name for legacy compatibility
        const selectedSubcategory = subcategories.find(
          (sub) => sub.id === data.subcategoryId
        );
        if (selectedSubcategory) {
          formData.append('subcategory', selectedSubcategory.name);
        }
      }

      formData.append('priority', data.priority);
      formData.append('opdId', data.opdId);
      formData.append('description', data.description);
      formData.append('location', data.location || '-');

      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });
        formData.append('image', compressedFile);
      }

      createReportMutation.mutate(formData);
    } catch (err) {
      toast.error('Terjadi kesalahan saat memproses form.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoadingOpds || isLoadingUsers || isLoadingCategories) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <LoadingScreen isLoading={createReportMutation.isPending} />
      <div className="mb-6">
        <PageHeader
          title="Buat Laporan Baru"
          backHref="/adm/kelola-pengaduan"
        />
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pelapor */}
          <Controller
            name="userId"
            control={control}
            rules={{ required: 'Pelapor wajib diisi.' }}
            render={({ field }) => (
              <SearchableSelect
                id="userId"
                label="Pelapor *"
                options={users.map((u) => ({
                  label: `${u.name} - ${u.email}`,
                  value: u.id.toString(),
                }))}
                value={field.value}
                onChange={field.onChange}
                placeholder="Pilih Pelapor"
                error={errors.userId?.message}
                disabled={users.length === 0 || isLoadingUsers}
                isLoading={isLoadingUsers}
              />
            )}
          />
          {users.length === 0 && (
            <p className="text-sm text-yellow-600 mt-1">
              Tidak ada data pelapor yang tersedia
            </p>
          )}

          {/* Judul */}
          <div>
            <Label htmlFor="title" value="Judul Laporan *" />
            <TextInput
              id="title"
              {...register('title', { required: true })}
              placeholder="Judul laporan"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">Judul wajib diisi.</p>
            )}
          </div>

          {/* Kategori */}
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: 'Kategori wajib diisi.' }}
            render={({ field }) => (
              <SearchableSelect
                id="categoryId"
                label="Kategori *"
                options={categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
                value={field.value}
                onChange={field.onChange}
                placeholder="Pilih Kategori"
                error={errors.categoryId?.message}
                disabled={isLoadingCategories || categories.length === 0}
                isLoading={isLoadingCategories}
              />
            )}
          />
          {categories.length === 0 && !isLoadingCategories && (
            <p className="text-sm text-yellow-600 mt-1">
              Tidak ada kategori yang tersedia. Silakan tambahkan kategori terlebih dahulu.
            </p>
          )}

          {/* Subkategori */}
          {categoryIdValue && (
            <Controller
              name="subcategoryId"
              control={control}
              rules={{ required: 'Subkategori wajib diisi.' }}
              render={({ field }) => (
                <SearchableSelect
                  id="subcategoryId"
                  label="Subkategori *"
                  options={subcategories.map((sub) => ({
                    label: sub.name,
                    value: sub.id,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pilih Subkategori"
                  error={errors.subcategoryId?.message}
                  disabled={isLoadingSubcategories || subcategories.length === 0}
                  isLoading={isLoadingSubcategories}
                />
              )}
            />
          )}
          {categoryIdValue && subcategories.length === 0 && !isLoadingSubcategories && (
            <p className="text-sm text-yellow-600 mt-1">
              Tidak ada subkategori untuk kategori ini.
            </p>
          )}

          {/* Prioritas */}
          <Controller
            name="priority"
            control={control}
            rules={{ required: 'Prioritas wajib diisi.' }}
            render={({ field }) => (
              <SearchableSelect
                id="priority"
                label="Prioritas *"
                options={[
                  { label: 'Rendah', value: 'LOW' },
                  { label: 'Sedang', value: 'MEDIUM' },
                  { label: 'Tinggi', value: 'HIGH' },
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Pilih Prioritas"
                error={errors.priority?.message}
              />
            )}
          />

          {/* OPD Tujuan */}
          <Controller
            name="opdId"
            control={control}
            rules={{ required: 'OPD wajib dipilih.' }}
            render={({ field }) => (
              <SearchableSelect
                id="opdId"
                label="OPD Tujuan *"
                options={opds.map((opd) => ({
                  label: opd.name,
                  value: opd.id.toString(),
                }))}
                value={field.value}
                onChange={field.onChange}
                placeholder="Pilih OPD"
                error={errors.opdId?.message}
                disabled={opds.length === 0 || isLoadingOpds}
                isLoading={isLoadingOpds}
              />
            )}
          />
          {opds.length === 0 && (
            <p className="text-sm text-yellow-600 mt-1">
              Tidak ada data OPD yang tersedia
            </p>
          )}

          {/* Deskripsi */}
          <div>
            <Label htmlFor="description" value="Deskripsi *" />
            <Textarea
              id="description"
              rows={4}
              {...register('description', { required: true })}
              placeholder="Deskripsikan laporan Anda"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                Deskripsi wajib diisi.
              </p>
            )}
          </div>

          {/* Lokasi */}
          <div>
            <Label htmlFor="location" value="Lokasi" />
            <TextInput
              id="location"
              {...register('location')}
              placeholder="Contoh: Jl. Ahmad Yani, Oesapa"
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <Label htmlFor="image" value="Gambar (opsional)" />
            <FileInput
              id="image"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              disabled={createReportMutation.isPending}
            />
            {imageFile && (
              <p className="text-sm text-green-600 mt-1">
                File dipilih: {imageFile.name}
              </p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              color="gray"
              onClick={handleCancel}
              disabled={createReportMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                createReportMutation.isPending ||
                users.length === 0 ||
                opds.length === 0
              }
            >
              {createReportMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Mengirim...
                </>
              ) : (
                'Kirim Laporan'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
