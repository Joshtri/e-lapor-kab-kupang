'use client';

import AuthRedirectGuard from '@/components/AuthRedirectGuard';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import { isMobile } from '@/utils/isMobile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Card, Label, TextInput } from 'flowbite-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiEye,
  HiEyeOff,
  HiOutlineLockClosed,
  HiOutlineLogin,
  HiOutlineMail,
} from 'react-icons/hi';
import { toast } from 'sonner';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import * as z from 'zod';
import Button from '@/components/ui/Button';

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // TanStack Query mutation for login
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post('/api/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      const user = data.user;
      toast.success('Login berhasil! Mengarahkan ke dashboard...');

      setTimeout(() => {
        switch (user.role) {
          case 'PELAPOR':
            router.push('/pelapor/dashboard');
            break;
          case 'ADMIN':
            router.push('/adm/dashboard');
            break;
          case 'BUPATI':
            router.push('/bupati-portal/dashboard');
            break;
          default:
            router.push('/');
        }
      }, 500);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Login gagal.');
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthRedirectGuard>
      <LoadingScreen isLoading={loginMutation.isPending} />
      <PWAInstallPrompt />
      {isMobile() && <PWAInstallPrompt />}

      <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-800 py-12 px-4 mt-10">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo container */}
            <div className="relative mb-6 flex justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24  flex items-center justify-center"
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

            <Card className="border-t-4 border-blue-500 shadow-lg bg-white/90 dark:bg-slate-800 backdrop-blur-sm">
              <div className="text-center mb-6">
                <Heading
                  level={2}
                  className="text-2xl font-bold mb-2 text-gray-900 dark:text-white"
                >
                  Selamat Datang di Lapor Kaka Bupati
                </Heading>
                <Text
                  variant="p"
                  className="text-gray-500 mb-0 dark:text-gray-300"
                >
                  Silakan masuk untuk mengakses akun Anda.
                </Text>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <Label
                    htmlFor="email"
                    value="Email"
                    className="flex items-center gap-2 mb-2"
                  >
                    <HiOutlineMail className="h-4 w-4 text-blue-600" />
                    <span>Email</span>
                  </Label>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    {...register('email')}
                    color={errors.email ? 'failure' : 'gray'}
                    className="bg-blue-50 dark:bg-gray-800 bg-border-blue-100 focus:border-blue-500"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password Field with Eye Toggle */}
                <div className="relative">
                  <Label
                    htmlFor="password"
                    value="Password"
                    className="flex items-center gap-2 mb-2"
                  >
                    <HiOutlineLockClosed className="h-4 w-4 text-blue-600" />
                    <span>Password</span>
                  </Label>
                  <div className="relative">
                    <TextInput
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      color={errors.password ? 'failure' : 'gray'}
                      className="bg-blue-50 dark:bg-gray-800 border-blue-100 focus:border-blue-500 pr-12" // Tambah padding-right lebih besar untuk ruang ikon
                    />
                    {/* Eye Icon Button */}
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <HiEyeOff size={18} />
                      ) : (
                        <HiEye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.password.message}
                    </span>
                  )}
                  <div className="text-right mt-2">
                    <Link
                      href="/auth/forgot-password"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}

                <Button
                  type="submit"
                  color="blue"
                  startIcon={<HiOutlineLogin className="h-5 w-5" />}
                  className="w-full flex items-center justify-center gap-2"
                  // size="lg"
                  disabled={loginMutation.isPending}
                >
                  {/* <HiOutlineLogin className="h-5 w-5" /> */}
                  {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
                </Button>

                <Text
                  variant="p"
                  className="text-center text-sm text-gray-600 dark:text-gray-200"
                >
                  Belum punya akun?{' '}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Daftar di sini
                  </Link>
                </Text>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthRedirectGuard>
  );
}
