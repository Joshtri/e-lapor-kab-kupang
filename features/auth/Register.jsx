'use client';

import Image from 'next/image';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { isMobile } from '@/utils/isMobile';
import { Card, Label, TextInput } from 'flowbite-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  HiEye,
  HiEyeOff,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiPaperAirplane,
} from 'react-icons/hi';
import { toast } from 'sonner';

import MaskedNikInput from '@/components/ui/inputs/MaskedNikInput';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';

export default function RegistrationPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm({
    defaultValues: {
      fullName: '',
      nikNumber: '',
      contactNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // Watch all form fields to calculate progress
  const formValues = watch();

  // Validasi functions
  const validateFullName = (value) => {
    if (!value) return 'Nama lengkap wajib diisi';
    if (value.length < 3) return 'Nama lengkap minimal 3 karakter';
    return true;
  };

  const validateNikNumber = (value) => {
    if (!value) return 'NIK wajib diisi';
    if (!/^\d+$/.test(value)) return 'NIK harus berupa angka';
    if (value.length !== 16) return 'NIK harus 16 digit angka';
    return true;
  };

  const validateContactNumber = (value) => {
    if (!value) return 'Nomor kontak wajib diisi';
    if (!/^\d+$/.test(value)) return 'Nomor kontak harus berupa angka';
    if (value.length < 10 || value.length > 15)
      return 'Nomor kontak harus antara 10-15 digit';
    return true;
  };

  const validateEmail = (value) => {
    if (!value) return 'Email wajib diisi';
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(value)) return 'Email tidak valid';
    return true;
  };

  const validatePassword = (value) => {
    if (!value) return 'Password wajib diisi';
    if (value.length < 6) return 'Password minimal 6 karakter';
    if (!/[A-Z]/.test(value)) return 'Password harus mengandung huruf besar';
    if (!/[0-9]/.test(value)) return 'Password harus mengandung angka';
    if (!/[!@#$%^&*]/.test(value))
      return 'Password harus mengandung simbol (!@#$%^&*)';
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (!value) return 'Konfirmasi password wajib diisi';
    if (value !== formValues.password) return 'Password tidak cocok';
    return true;
  };

  // Calculate form completion progress
  useEffect(() => {
    const fields = [
      'fullName',
      'nikNumber',
      'contactNumber',
      'email',
      'password',
    ];
    const filledFields = fields.filter(
      (field) => formValues[field]?.length > 0,
    ).length;
    setFormProgress((filledFields / fields.length) * 100);
  }, [formValues]);

  // TanStack Query mutation for registration
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...submitData } = data;
      const res = await axios.post('/api/auth/register', submitData);
      return res.data;
    },
    onSuccess: () => {
      toast.success(
        'Pendaftaran berhasil! Anda akan dialihkan ke halaman login.',
      );

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || 'Terjadi kesalahan saat mendaftar.',
      );
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-800 py-12 px-4 mt-14">
      <LoadingScreen isLoading={registerMutation.isPending} />
      {isMobile() && <PWAInstallPrompt />}
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo header */}
          <div className="relative mb-6 flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24  flex items-center justify-center "
            >
              <Image
                src="/fixed-logo-app.png"
                alt="Lapor Kaka Bupati Logo"
                width={80}
                height={80}
                priority
              />
            </motion.div>
          </div>

          <Card className="border-t-4 border-blue-500 shadow-lg bg-white/90 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Buat Akun Lapor Kaka Bupati
              </h2>
              <p className="text-gray-500 dark:text-gray-300">
                Silakan isi formulir untuk membuat akun Anda.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-blue-800 rounded-full h-2.5 mb-6">
              <motion.div
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Nama Lengkap */}
              <div>
                <Label
                  htmlFor="fullName"
                  className="flex items-center gap-2 mb-2"
                >
                  <HiOutlineUser className="h-4 w-4 text-blue-600" />
                  <span>
                    Nama Lengkap <span className="text-red-500">*</span>
                  </span>
                </Label>
                <TextInput
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  {...register('fullName', {
                    required: 'Nama lengkap wajib diisi',
                    validate: validateFullName,
                    onBlur: () => trigger('fullName'),
                  })}
                  color={errors.fullName ? 'failure' : 'gray'}
                  className="bg-blue-50 dark:bg-gray-800 border-blue-100 focus:border-blue-500"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              <MaskedNikInput
                value={formValues.nikNumber}
                onChange={(val) => {
                  setValue('nikNumber', val, { shouldValidate: true });
                  trigger('nikNumber');
                }}
                error={errors.nikNumber?.message}
                helperText="Pastikan NIK Anda berisi 16 digit angka."
              />

              {/* Nomor Kontak */}
              <div>
                <Label
                  htmlFor="contactNumber"
                  className="flex items-center gap-2 mb-2"
                >
                  <HiOutlinePhone className="h-4 w-4 text-blue-600" />
                  <span>
                    Nomor Kontak <span className="text-red-500">*</span>
                  </span>
                </Label>

                <TextInput
                  id="contactNumber"
                  type="text"
                  placeholder="Masukkan nomor kontak"
                  {...register('contactNumber', {
                    required: 'Nomor kontak wajib diisi',
                    validate: validateContactNumber,
                    onBlur: () => trigger('contactNumber'),
                  })}
                  maxLength={15}
                  inputMode="numeric"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /\D/g,
                      '',
                    );
                  }}
                  color={errors.contactNumber ? 'failure' : 'gray'}
                  className={`bg-blue-50 dark:bg-gray-800 border ${
                    errors.contactNumber ? 'border-red-500' : 'border-blue-100'
                  } focus:border-blue-500`}
                />

                {errors.contactNumber && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.contactNumber.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-2 flex gap-2 items-center">
                  <HiOutlineMail className="h-4 w-4 text-blue-600" />
                  <span>
                    Email <span className="text-red-500">*</span>
                  </span>
                </Label>
                <TextInput
                  id="email"
                  placeholder="email@example.com"
                  {...register('email', {
                    required: 'Email wajib diisi',
                    validate: validateEmail,
                    onBlur: () => trigger('email'),
                  })}
                  helperText="Gunakan alamat email yang valid dan aktif."
                  color={errors.email ? 'failure' : 'gray'}
                />

                {errors.email && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 mb-2"
                >
                  <HiOutlineLockClosed className="h-4 w-4 text-blue-600" />
                  <span>
                    Password <span className="text-red-500">*</span>
                  </span>
                </Label>

                <TextInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan Password"
                  {...register('password', {
                    required: 'Password wajib diisi',
                    validate: validatePassword,
                    onBlur: () => trigger('password'),
                  })}
                  helperText={
                    errors.password?.message ??
                    'Minimal 6 karakter, ada huruf besar, angka, dan simbol.'
                  }
                  color={errors.password ? 'failure' : 'gray'}
                  className="bg-blue-50 dark:bg-gray-800 border-blue-100 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff size={18} className="dark:text-white" />
                  ) : (
                    <HiEye size={18} className="dark:text-white" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Label
                  htmlFor="confirmPassword"
                  className="mb-2 flex gap-2 items-center"
                >
                  <HiOutlineLockClosed className="h-4 w-4 text-blue-600" />
                  <span>
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </span>
                </Label>
                <TextInput
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  {...register('confirmPassword', {
                    required: 'Konfirmasi password wajib diisi',
                    validate: validateConfirmPassword,
                    onBlur: () => trigger('confirmPassword'),
                  })}
                  helperText={
                    errors.confirmPassword?.message ??
                    'Masukkan ulang password yang sama untuk konfirmasi.'
                  }
                  color={errors.confirmPassword ? 'failure' : 'gray'}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-600 dark:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <HiEyeOff size={18} />
                  ) : (
                    <HiEye size={18} />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                startIcon={<HiPaperAirplane />}
                disabled={registerMutation.isPending}
                className="flex items-center justify-center gap-2 mt-4"
              >
                {registerMutation.isPending ? 'Memproses...' : <>Daftar</>}
              </Button>

              <div className="text-center mt-4">
                <Text
                  variant="p"
                  className="text-sm text-gray-600 dark:text-gray-200"
                >
                  Sudah memiliki akun?{' '}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Login di sini
                  </Link>
                </Text>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
