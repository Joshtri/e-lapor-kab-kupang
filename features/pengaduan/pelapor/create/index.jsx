'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Alert, Card } from 'flowbite-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  HiChevronLeft,
  HiOutlineExclamation,
  HiPaperAirplane,
} from 'react-icons/hi';
import Link from 'next/link';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { useCreateReport, useRegisterPushNotification } from './hooks';
import StepIndicator from '@/components/ui/StepIndicator';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
// import StepIndicator from '@/components/pelapor/ui/StepIndicator';

const stepTitles = {
  1: 'Buat Pengaduan - Informasi Dasar',
  2: 'Buat Pengaduan - Detail Pengaduan',
  3: 'Buat Pengaduan - Konfirmasi',
};

const stepDescriptions = {
  1: 'Isi informasi dasar pengaduan Anda',
  2: 'Sediakan detail lengkap tentang pengaduan',
  3: 'Periksa dan konfirmasi pengaduan Anda',
};

const categoryMap = {
  INFRASTRUKTUR: 'Infrastruktur',
  PELAYANAN: 'Pelayanan Publik',
  SOSIAL: 'Permasalahan Sosial',
  LAINNYA: 'Lainnya',
};

const priorityMap = {
  LOW: 'Rendah',
  MEDIUM: 'Sedang',
  HIGH: 'Tinggi',
};

const CreatePengaduanForm = ({ user, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    categoryId: '', // ✅ NEW: Menyimpan ID kategori
    subcategory: '',
    subcategoryId: '', // ✅ NEW: Menyimpan ID subkategori
    priority: 'LOW',
    opdId: '',
    location: '',
    status: 'PENDING',
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const createReportMutation = useCreateReport();

  // ✅ Removed: Push notification registration sudah ada di NotificationPermissionBanner
  // Tidak perlu auto-request lagi di form ini

  // Form change handler
  const handleFormChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user changes value
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors],
  );

  // Files change handler
  const handleFilesChange = useCallback((newFiles) => {
    setFiles(newFiles);
  }, []);

  // Validation functions
  const validateStep1 = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul pengaduan wajib diisi';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (!formData.priority) {
      newErrors.priority = 'Prioritas wajib dipilih';
    }

    if (!formData.opdId) {
      newErrors.opdId = 'OPD tujuan wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title, formData.category, formData.priority, formData.opdId]);

  const validateStep2 = useCallback(() => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi pengaduan wajib diisi';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Deskripsi terlalu pendek (minimal 20 karakter)';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.description, formData.location]);

  // Navigation handlers
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);

      // ✅ NEW: Kirim categoryId dan subcategoryId (prioritas)
      if (formData.categoryId) {
        formDataObj.append('categoryId', formData.categoryId);
      }
      if (formData.subcategoryId) {
        formDataObj.append('subcategoryId', formData.subcategoryId);
      }

      // Legacy: kirim juga text untuk backward compatibility
      formDataObj.append('category', formData.category);
      formDataObj.append('subcategory', formData.subcategory);

      formDataObj.append('priority', formData.priority);
      formDataObj.append('opdId', formData.opdId);
      formDataObj.append('location', formData.location);
      formDataObj.append('status', formData.status);
      formDataObj.append('userId', user.id);

      if (files.length > 0) {
        formDataObj.append('image', files[0]);
      }

      await createReportMutation.mutateAsync(formDataObj);

      toast.success('Pengaduan berhasil dikirim!', {
        icon: <HiPaperAirplane className="h-5 w-5 text-green-500 rotate-90" />,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        categoryId: '',
        subcategory: '',
        subcategoryId: '',
        priority: 'LOW',
        opdId: '',
        location: '',
        status: 'PENDING',
      });
      setFiles([]);
      setStep(1);
      setErrors({});

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          'Gagal mengirim pengaduan. Silakan coba lagi.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <LoadingScreen isLoading={createReportMutation.isPending} />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/pelapor/dashboard">
              <Button
                color="light"
                size="sm"
                className="flex items-center gap-2"
              >
                <HiChevronLeft className="h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {stepTitles[step]}
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Card Container */}
        <Card className="shadow-lg">
          {/* Step Indicator */}
          <div className="mb-6">
            <StepIndicator step={step} totalSteps={3} />
          </div>

          {/* Info Banner */}
          <Alert icon={HiOutlineExclamation} color="info" className="mb-6">
            <span>
              Silakan isi formulir dengan lengkap dan jelas. Pengaduan Anda akan
              diteruskan ke OPD terkait dan Bupati.
            </span>
          </Alert>

          {/* Form Content */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1
                  key="step1"
                  formData={formData}
                  onFormChange={handleFormChange}
                  errors={errors}
                />
              )}

              {step === 2 && (
                <Step2
                  key="step2"
                  formData={formData}
                  files={files}
                  onFormChange={handleFormChange}
                  onFilesChange={handleFilesChange}
                  errors={errors}
                />
              )}

              {step === 3 && (
                <Step3
                  key="step3"
                  formData={formData}
                  files={files}
                  categoryMap={categoryMap}
                  priorityMap={priorityMap}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <Button
                color="light"
                onClick={handlePrevStep}
                disabled={createReportMutation.isPending}
              >
                Kembali
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button
                color="blue"
                onClick={handleNextStep}
                disabled={createReportMutation.isPending}
              >
                Lanjutkan
              </Button>
            ) : (
              <Button
                gradientDuoTone="blueToCyan"
                onClick={handleSubmit}
                isProcessing={createReportMutation.isPending}
                disabled={createReportMutation.isPending}
                className="flex items-center gap-2"
              >
                <HiPaperAirplane className="h-5 w-5" />
                {createReportMutation.isPending
                  ? 'Mengirim...'
                  : 'Kirim Pengaduan'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreatePengaduanForm;
