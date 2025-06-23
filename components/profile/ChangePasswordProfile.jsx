'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { TextInput, Button, Label, Spinner, Modal } from 'flowbite-react';
import { HiEye, HiEyeOff, HiOutlineKey } from 'react-icons/hi';
import axios from 'axios';
import { toast } from 'sonner';

export default function ChangePasswordModal({ open, setOpen }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data) => {
    try {
      await axios.patch('/api/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('✅ Password berhasil diubah!');
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengubah password.');
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)}>
      <Modal.Header>Ubah Password</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div>
            <Label htmlFor="currentPassword" value="Password Saat Ini" />
            <div className="relative">
              <TextInput
                id="currentPassword"
                type={showPassword.current ? 'text' : 'password'}
                {...register('currentPassword', {
                  required: 'Wajib diisi',
                })}
              />
              <button
                type="button"
                onClick={() => togglePassword('current')}
                className="absolute right-2 top-2 text-gray-600"
              >
                {showPassword.current ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword" value="Password Baru" />
            <div className="relative">
              <TextInput
                id="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                {...register('newPassword', {
                  required: 'Wajib diisi',
                  minLength: {
                    value: 6,
                    message: 'Minimal 6 karakter',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => togglePassword('new')}
                className="absolute right-2 top-2 text-gray-600"
              >
                {showPassword.new ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmNewPassword" value="Konfirmasi Password Baru" />
            <div className="relative">
              <TextInput
                id="confirmNewPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                {...register('confirmNewPassword', {
                  required: 'Wajib diisi',
                  validate: (value) =>
                    value === watch('newPassword') || 'Konfirmasi tidak cocok',
                })}
              />
              <button
                type="button"
                onClick={() => togglePassword('confirm')}
                className="absolute right-2 top-2 text-gray-600"
              >
                {showPassword.confirm ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={() => setOpen(false)}>
          Batal
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner size="sm" className="mr-2" />
          ) : (
            <HiOutlineKey className="w-4 h-4 mr-2" />
          )}
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
