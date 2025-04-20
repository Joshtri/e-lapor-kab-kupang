'use client';

import {
  Button,
  Label,
  Textarea,
  TextInput,
  Card,
  Select,
  Alert,
  FileInput,
  Tooltip,
} from 'flowbite-react';
import {
  HiExclamationCircle,
  HiOutlineArrowLeft,
  HiOutlineLightBulb,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineExclamation,
  HiOutlineChartBar,
  HiOutlinePaperClip,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LaporBugCreatePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priorityProblem: 'LOW',
      attachment: null,
    },
  });

  const router = useRouter();
  const toFormData = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('priorityProblem', data.priorityProblem);
    if (data.attachment?.[0]) {
      formData.append('attachment', data.attachment[0]);
    }
    return formData;
  };

  const onSubmit = async (data) => {
    const formData = toFormData(data);

    try {
      await axios.post('/api/pelapor/bug-reports', formData);
      toast.success('Laporan bug berhasil dikirim!');
      reset();

      router.push('/pelapor/lapor-bug'); // Redirect to the bug report list page
    } catch (err) {
      err;
      toast.error('Gagal mengirim laporan bug.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Back button */}
        <div className="flex items-center justify-between">
          <Link href="/pelapor/dashboard">
            <Button color="light" className="flex items-center gap-2">
              <HiOutlineArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard
            </Button>
          </Link>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Laporan Bug
          </h1>
        </div>

        {/* Info Card */}
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <HiOutlineLightBulb className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Panduan Melaporkan Bug
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  Berikan judul yang jelas dan spesifik tentang masalah yang
                  Anda temukan
                </li>
                <li>
                  Jelaskan langkah-langkah untuk mereproduksi bug tersebut
                </li>
                <li>
                  Sertakan screenshot jika memungkinkan untuk memperjelas
                  masalah
                </li>
                <li>
                  Tentukan tingkat prioritas sesuai dengan dampak bug tersebut
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Alert */}
        <Alert
          color="warning"
          icon={HiExclamationCircle}
          className="font-medium"
        >
          <span className="font-bold">Penting:</span> Laporan bug yang detail
          akan membantu tim pengembang menyelesaikan masalah dengan lebih cepat.
        </Alert>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <HiOutlineExclamation className="text-red-600 dark:text-red-400 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Formulir Laporan Bug
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineDocumentText className="text-gray-600 dark:text-gray-300 w-5 h-5" />
                <Label
                  htmlFor="title"
                  value="Bug/Masalah yang ditemukan"
                  className="font-medium"
                />
                <Tooltip content="Berikan judul yang singkat dan jelas">
                  <HiOutlineInformationCircle className="text-gray-400 w-4 h-4 cursor-help" />
                </Tooltip>
              </div>
              <TextInput
                id="title"
                placeholder="Contoh: Tidak bisa submit laporan"
                {...register('title', { required: true })}
                color={errors.title ? 'failure' : 'gray'}
                helperText={errors.title && 'Judul laporan wajib diisi'}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineDocumentText className="text-gray-600 dark:text-gray-300 w-5 h-5" />
                <Label
                  htmlFor="description"
                  value="Deskripsi Bug"
                  className="font-medium"
                />
                <Tooltip content="Jelaskan secara detail langkah-langkah untuk mereproduksi bug">
                  <HiOutlineInformationCircle className="text-gray-400 w-4 h-4 cursor-help" />
                </Tooltip>
              </div>
              <Textarea
                id="description"
                placeholder="Jelaskan langkah dan kondisi saat bug muncul..."
                rows={4}
                {...register('description', { required: true })}
                color={errors.description ? 'failure' : 'gray'}
                helperText={errors.description && 'Deskripsi bug wajib diisi'}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineChartBar className="text-gray-600 dark:text-gray-300 w-5 h-5" />
                <Label
                  htmlFor="priorityProblem"
                  value="Tingkat Prioritas"
                  className="font-medium"
                />
                <Tooltip content="Pilih prioritas sesuai dengan tingkat keparahan bug">
                  <HiOutlineInformationCircle className="text-gray-400 w-4 h-4 cursor-help" />
                </Tooltip>
              </div>
              <Select id="priorityProblem" {...register('priorityProblem')}>
                <option value="LOW">
                  Rendah - Tidak mengganggu fungsi utama
                </option>
                <option value="MEDIUM">
                  Sedang - Mengganggu beberapa fungsi
                </option>
                <option value="HIGH">
                  Tinggi - Mengganggu fungsi utama aplikasi
                </option>
              </Select>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlinePaperClip className="text-gray-600 dark:text-gray-300 w-5 h-5" />
                <Label
                  htmlFor="attachment"
                  value="Lampiran (Opsional)"
                  className="font-medium"
                />
                <Tooltip content="Unggah screenshot atau dokumen pendukung">
                  <HiOutlineInformationCircle className="text-gray-400 w-4 h-4 cursor-help" />
                </Tooltip>
              </div>
              <FileInput
                id="attachment"
                accept="image/*,application/pdf"
                {...register('attachment')}
                helperText="Unggah gambar atau PDF (maks. 5MB)"
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                color="red"
                size="lg"
                isProcessing={isSubmitting}
                className="px-8"
              >
                <HiOutlineExclamation className="mr-2 h-5 w-5" />
                Kirim Laporan Bug
              </Button>
            </div>
          </form>
        </Card>

        {/* Additional Info */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
            <HiOutlinePhotograph className="w-5 h-5" />
            <span className="font-medium">Tips:</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sertakan screenshot yang menunjukkan bug tersebut akan sangat
            membantu tim pengembang. Pastikan screenshot menampilkan seluruh
            halaman dan pesan error yang muncul.
          </p>
        </div>
      </div>
    </div>
  );
}
