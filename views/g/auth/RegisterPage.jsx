'use client';

import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { isMobile } from '@/utils/isMobile';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiEye,
  HiEyeOff,
  HiOutlineDocumentAdd,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiPaperAirplane,
} from 'react-icons/hi';
import { toast } from 'sonner';

// Skema validasi dengan Zod (dengan batasan NIK hanya angka)
import MaskedNikInput from '@/components/ui/MaskedNikInput';
import { registerSchema } from '@/lib/validations/registerSchema';

export default function RegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange', // validasi langsung saat mengetik
  });

  // Watch all form fields to calculate progress
  const formValues = watch();

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await axios.post('/api/auth/register', data);
      toast.success(
        'Pendaftaran berhasil! Anda akan dialihkan ke halaman login.',
      );

      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.error || 'Terjadi kesalahan saat mendaftar.',
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-800 py-12 px-4 mt-14">
      {isMobile() && <PWAInstallPrompt />}
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Envelope header */}
          <div className="relative mb-6 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md z-10">
              <HiOutlineDocumentAdd className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <Card className="border-t-4 border-blue-500 shadow-lg bg-white/90 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Buat Akun Lapor KK Bupati
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
                  value="NAMA LENGKAP"
                  className="flex items-center gap-2 mb-2"
                >
                  <HiOutlineUser className="h-4 w-4 text-blue-600" />
                  <span>Nama Lengkap</span>
                </Label>
                <TextInput
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  {...register('fullName')}
                  color={errors.fullName ? 'failure' : 'gray'}
                  className="bg-blue-50 dark:bg-gray-800 border-blue-100 focus:border-blue-500"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              {/* NIK */}

              {/* <Label
                  htmlFor="nikNumber"
                  className="mb-2 flex gap-2 items-center"
                >
                  <HiOutlineIdentification className="h-4 w-4 text-blue-600" />
                  <span>Nomor Identitas (NIK)</span>
                </Label> */}

              <MaskedNikInput
                value={formValues.nikNumber}
                onChange={(val) => {
                  const event = {
                    target: {
                      name: 'nikNumber',
                      value: val,
                    },
                  };
                  register('nikNumber').onChange(event);
                }}
                error={errors.nikNumber?.message}
                helperText="Pastikan NIK Anda berisi 16 digit angka."
              />

              {/* Nomor Kontak */}
              <div>
                <Label
                  htmlFor="contactNumber"
                  value="NOMOR KONTAK"
                  className="flex items-center gap-2 mb-2"
                >
                  <HiOutlinePhone className="h-4 w-4 text-blue-600" />
                  <span>Nomor Kontak</span>
                </Label>
                <TextInput
                  id="contactNumber"
                  type="text"
                  placeholder="Masukkan nomor kontak"
                  {...register('contactNumber')}
                  maxLength={15}
                  inputMode="numeric"
                  pattern="\d*"
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
                  <span>Email</span>
                </Label>
                <TextInput
                  id="email"
                  placeholder="email@example.com"
                  {...register('email')}
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
                  value="PASSWORD"
                  className="flex items-center gap-2 mb-2"
                >
                  <HiOutlineLockClosed className="h-4 w-4 text-blue-600" />
                  <span>Password</span>
                </Label>
                <TextInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan Password"
                  {...register('password')}
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
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Label
                  htmlFor="confirmPassword"
                  className="mb-2 flex gap-2 items-center"
                >
                  <HiOutlineLockClosed className="h-4 w-4 text-blue-600" />
                  <span>Konfirmasi Password</span>
                </Label>
                <TextInput
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  {...register('confirmPassword')}
                  helperText={
                    errors.confirmPassword?.message ??
                    'Masukkan ulang password yang sama untuk konfirmasi.'
                  }
                  color={errors.confirmPassword ? 'failure' : 'gray'}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-600"
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
                color="blue"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  'Memproses...'
                ) : (
                  <>
                    <HiPaperAirplane className="h-5 w-5" />
                    Daftar
                  </>
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  Sudah memiliki akun?{' '}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Login di sini
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
