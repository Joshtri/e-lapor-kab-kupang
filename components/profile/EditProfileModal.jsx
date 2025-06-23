'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label, TextInput, Button, Modal, Select } from 'flowbite-react';
import MaskedNikInput from '../ui/MaskedNikInput';

export default function EditProfileModal({ open, setOpen, user, onSave }) {
  const [tipeIdentitas, setTipeIdentitas] = useState('NIK');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
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
    <Modal show={open} onClose={() => setOpen(false)}>
      <Modal.Header>Edit Profil</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" value="Nama Lengkap" />
            <TextInput id="name" {...register('name')} required />
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput id="email" {...register('email')} type="email" required />
          </div>

          <div>
            <Label htmlFor="contactNumber" value="Nomor Kontak" />
            <TextInput id="contactNumber" {...register('contactNumber')} />
          </div>

          <div>
            <Label htmlFor="tipeIdentitas" value="Tipe Identitas" />
            <Select
              id="tipeIdentitas"
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
        </form>
      </Modal.Body>

      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={() => setOpen(false)}>
          Batal
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)} gradientDuoTone="cyanToBlue">
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
