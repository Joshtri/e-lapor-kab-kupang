'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import {
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useResetPassword } from '@/services/authService';
import Heading from '@/components/ui/Heading';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    mutate: resetPasswordMutate,
    isPending,
    isError,
    error,
  } = useResetPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (newPassword !== confirmPassword) {
      setValidationError('Password tidak cocok.');
      return;
    }

    if (!token) {
      setValidationError('Token tidak valid.');
      return;
    }

    resetPasswordMutate(
      { token, newPassword },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => router.push('/auth/login'), 3000);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-800 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Envelope icon */}
        <div className="relative mb-6 flex justify-center">
          <motion.div
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md z-10"
            animate={{ rotateY: isSuccess ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {isSuccess ? (
              <HiOutlineCheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <HiOutlineShieldCheck className="h-10 w-10 text-blue-600" />
            )}
          </motion.div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-t-4 border-blue-500">
          <Heading className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Reset Password
          </Heading>

          {(validationError || isError) && (
            <div className="mb-6 p-4 border rounded bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300">
              {validationError ||
                error?.response?.data?.error ||
                'Terjadi kesalahan, coba lagi.'}
            </div>
          )}

          {isSuccess && (
            <div className="mb-6 p-4 border rounded bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
              Password berhasil diubah. Mengarahkan ke login...
            </div>
          )}

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Password Baru */}
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2"
                >
                  <HiOutlineLockClosed className="h-4 w-4 text-blue-600" />
                  <span>Password Baru</span>
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full p-3 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-10 text-gray-600 dark:text-gray-300"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Input Konfirmasi Password */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2"
                >
                  <HiOutlineLockClosed className="h-4 w-4 text-blue-600" />
                  <span>Konfirmasi Password</span>
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full p-3 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-600 dark:text-gray-300"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Tombol Reset Password */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 text-white" />
                    Mengubah Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {isSuccess && (
            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Kembali ke halaman login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
