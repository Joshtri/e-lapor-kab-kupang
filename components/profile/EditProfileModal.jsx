'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label, TextInput, Button } from 'flowbite-react';
import MaskedNikInput from '../ui/MaskedNikInput';
import { Select } from 'flowbite-react';

export default function EditProfileModal({ open, setOpen, user, onSave }) {
  const [tipeIdentitas, setTipeIdentitas] = useState('NIK');
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      contactNumber: '',
      nikNumber: '',
    },
  });

  const [nikDisplay, setNikDisplay] = useState('');

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        nikNumber: user.nikNumber || '',
      });
      setNikDisplay(user.nikMasked || '');
    }
  }, [user, open, reset]);

  const onSubmit = async (data) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Edit Profil
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label value="Nama Lengkap" />
                    <TextInput {...register('name')} required />
                  </div>
                  <div>
                    <Label value="Email" />
                    <TextInput {...register('email')} type="email" required />
                  </div>
                  <div>
                    <Label value="Nomor Kontak" />
                    <TextInput {...register('contactNumber')} />
                  </div>

                  {/* Select Tipe Identitas */}
                  <div>
                    <Label value="Tipe Identitas" />
                    <Select
                      value={tipeIdentitas}
                      onChange={(e) => setTipeIdentitas(e.target.value)}
                    >
                      <option value="NIK">NIK (16 digit)</option>
                      <option value="NIP">NIP (18 digit)</option>
                    </Select>
                  </div>

                  <MaskedNikInput
                    type={tipeIdentitas}
                    value={nikDisplay}
                    onChange={(val) => {
                      setNikDisplay(val);
                      setValue('nikNumber', val);
                    }}
                    helperText={`Masukkan ${
                      tipeIdentitas === 'NIP' ? '18' : '16'
                    } digit ${tipeIdentitas}`}
                  />

                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      color="gray"
                      type="button"
                      onClick={() => setOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit" gradientDuoTone="cyanToBlue">
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
