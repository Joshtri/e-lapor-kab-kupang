'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State untuk show/hide password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);

    if (newPassword !== confirmPassword) {
      setError(true);
      setMessage('Password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Password berhasil diubah. Mengarahkan ke login...');
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        setError(true);
        setMessage(data.error || 'Terjadi kesalahan, coba lagi.');
      }
    } catch (error) {
      setError(true);
      setMessage('Gagal mereset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 py-12 px-4">
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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Reset Password
          </h2>

          {message && (
            <div
              className={`mb-6 p-4 border rounded ${
                error
                  ? 'bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
                  : 'bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
              }`}
            >
              {message}
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
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
