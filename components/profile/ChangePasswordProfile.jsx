'use client';

import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { TextInput, Button, Label, Spinner } from 'flowbite-react';
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
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold text-gray-900 dark:text-white mb-4"
                >
                  Ubah Password
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label value="Password Saat Ini" />
                    <div className="relative">
                      <TextInput
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

                  <div>
                    <Label value="Password Baru" />
                    <div className="relative">
                      <TextInput
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

                  <div>
                    <Label value="Konfirmasi Password Baru" />
                    <div className="relative">
                      <TextInput
                        type={showPassword.confirm ? 'text' : 'password'}
                        {...register('confirmNewPassword', {
                          required: 'Wajib diisi',
                          validate: (value) =>
                            value === watch('newPassword') ||
                            'Konfirmasi tidak cocok',
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

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      color="gray"
                      type="button"
                      onClick={() => setOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      gradientDuoTone="cyanToBlue"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Spinner size="sm" className="mr-2" />
                      ) : (
                        <HiOutlineKey className="w-4 h-4 mr-2" />
                      )}
                      Simpan
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
