'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import * as z from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineDocumentAdd,
  HiPaperAirplane,
  HiEye,
  HiEyeOff,
} from 'react-icons/hi';

// Skema validasi dengan Zod (dengan batasan NIK hanya angka)
const formSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama harus minimal 3 karakter.' }),
  nikNumber: z
    .string()
    .length(16, { message: 'NIK harus tepat 16 digit.' })
    .regex(/^\d+$/, { message: 'NIK hanya boleh berisi angka.' }),
  contactNumber: z
    .string()
    .min(10, { message: 'Nomor kontak minimal 10 digit.' })
    .regex(/^\d+$/, { message: 'Nomor kontak hanya boleh berisi angka.' }),
  email: z.string().email({ message: 'Email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

export default function RegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
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
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4">
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
              <h2 className="text-2xl font-bold text-gray-900">
                Buat Akun Lapor KK Bupati
              </h2>
              <p className="text-gray-500">
                Silakan isi formulir untuk membuat akun Anda.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
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
                  className="bg-blue-50 border-blue-100 focus:border-blue-500"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              {/* NIK */}
              <div>
                <Label
                  htmlFor="nikNumber"
                  value="NOMOR IDENTITAS (NIK)"
                  className="flex items-center gap-2 mb-2"
                >
                  <HiOutlineIdentification className="h-4 w-4 text-blue-600" />
                  <span>Nomor Identitas (NIK)</span>
                </Label>
                <TextInput
                  id="nikNumber"
                  type="text"
                  placeholder="Masukkan NIK"
                  maxLength={16}
                  {...register('nikNumber')}
                  color={errors.nikNumber ? 'failure' : 'gray'}
                  className="bg-blue-50 border-blue-100 focus:border-blue-500"
                />
                {errors.nikNumber && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.nikNumber.message}
                  </span>
                )}
              </div>

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
                  color={errors.contactNumber ? 'failure' : 'gray'}
                  className="bg-blue-50 border-blue-100 focus:border-blue-500"
                />
                {errors.contactNumber && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.contactNumber.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  value="EMAIL"
                  className="flex items-center gap-2 mb-2"
                >
                  <HiOutlineMail className="h-4 w-4 text-blue-600" />
                  <span>Email</span>
                </Label>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Masukkan EMAIL"
                  {...register('email')}
                  color={errors.email ? 'failure' : 'gray'}
                  className="bg-blue-50 border-blue-100 focus:border-blue-500"
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
                  color={errors.password ? 'failure' : 'gray'}
                  className="bg-blue-50 border-blue-100 focus:border-blue-500"
                />
                {/* Eye Icon Button */}
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.password.message}
                  </span>
                )}
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
                <p className="text-sm text-gray-600">
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
