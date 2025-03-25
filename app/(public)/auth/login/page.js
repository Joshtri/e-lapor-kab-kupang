'use client';

import { useState, useEffect } from 'react';
import { Card, TextInput, Label, Button } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import * as z from 'zod';
import AuthRedirectGuard from '@/components/AuthRedirectGuard';
import {
  HiOutlineLogin,
  HiEye,
  HiEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiMailOpen,
} from 'react-icons/hi';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Watch for input changes to animate envelope
  const email = watch('email', '');
  const password = watch('password', '');

  useEffect(() => {
    if (email.length > 0 || password.length > 0) {
      setIsEnvelopeOpen(true);
    } else {
      setIsEnvelopeOpen(false);
    }
  }, [email, password]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/auth/login', data);
      const user = res.data.user;

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
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthRedirectGuard>
      <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Envelope container */}
            <div className="relative mb-6">
              {/* Envelope flap - animates open/closed */}
              <motion.div
                className="absolute top-0 left-1/2 w-full h-16 bg-blue-500 z-10 origin-bottom"
                initial={{ rotateX: 0, translateX: '-50%' }}
                animate={{
                  rotateX: isEnvelopeOpen ? -180 : 0,
                  translateX: '-50%',
                }}
                transition={{ duration: 0.5 }}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="absolute inset-0 bg-blue-600 skew-y-3 transform origin-bottom"></div>
              </motion.div>

              {/* Envelope icon */}
              <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-md z-20 relative">
                {isEnvelopeOpen ? (
                  <HiMailOpen className="h-10 w-10 text-blue-600" />
                ) : (
                  <HiOutlineMail className="h-10 w-10 text-blue-600" />
                )}
              </div>
            </div>

            <Card className="border-t-4 border-blue-500 shadow-lg bg-white/90 dark:bg-slate-800 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  Selamat Datang di E-Lapor
                </h2>
                <p className="text-gray-500 mb-0 dark:text-gray-300">
                  Silakan masuk untuk mengakses akun Anda.
                </p>
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
                  <TextInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    color={errors.password ? 'failure' : 'gray'}
                    className="bg-blue-50 dark:bg-gray-800 border-blue-100 focus:border-blue-500"
                  />
                  {/* Eye Icon Button */}
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEyeOff size={18} />
                    ) : (
                      <HiEye size={18} />
                    )}
                  </button>
                  {errors.password && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Forget Password Link */}
                <div className="text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Lupa Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  color="blue"
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <HiOutlineLogin className="h-5 w-5" />
                  {isSubmitting ? 'Memproses...' : 'Masuk'}
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-200">
                  Belum punya akun?{' '}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Daftar di sini
                  </Link>
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthRedirectGuard>
  );
}
