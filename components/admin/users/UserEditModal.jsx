'use client';

import axios from 'axios';
import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MaskedNikInput from '@/components/ui/MaskedNikInput';
import ResetButton from '@/components/ui/ResetButton';

const UserEditModal = ({
  open,
  setOpen,
  user,
  onSuccess,
  identitasType: initialType = 'NIK',
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const [nikDisplay, setNikDisplay] = useState('');
  const [identitasType, setIdentitasType] = useState(initialType);

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        nikNumber: user.nikNumber || '',
        role: user.role || '',
      });
      setNikDisplay(user.nikMasked || '');
      setIdentitasType(initialType); // reset tipe identitas ke default
    }
  }, [user, open, reset, initialType]);

  const onSubmit = async (data) => {
    try {
      await axios.patch(`/api/users/${user.id}`, data);
      toast.success('User berhasil diperbarui!');
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui user.');
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="md">
      <Modal.Header>Edit User</Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="space-y-4">
          <div>
            <Label htmlFor="name" value="Nama Lengkap" />
            <TextInput id="name" {...register('name')} required />
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              {...register('email')}
              required
            />
          </div>

          <div>
            <Label htmlFor="contactNumber" value="Nomor Telepon" />
            <TextInput id="contactNumber" {...register('contactNumber')} />
          </div>

          <div>
            <Label htmlFor="tipe" value="Tipe Identitas" />
            <Select
              id="tipe"
              value={identitasType}
              onChange={(e) => setIdentitasType(e.target.value)}
            >
              <option value="NIK">NIK (16 digit)</option>
              <option value="NIP">NIP (18 digit)</option>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="nikNumber"
              value={`${identitasType} (${identitasType === 'NIP' ? '18' : '16'} digit)`}
            />
            <MaskedNikInput
              type={identitasType}
              value={nikDisplay}
              onChange={(val) => {
                setNikDisplay(val);
                setValue('nikNumber', val);
              }}
              helperText={`Masukkan ${identitasType === 'NIP' ? '18' : '16'} digit ${identitasType}`}
            />
          </div>

          <div>
            <Label htmlFor="role" value="Role" />
            <Select id="role" {...register('role')} required>
              <option value="ADMIN">Admin</option>
              <option value="BUPATI">Bupati</option>
              <option value="OPD">OPD</option>
              <option value="PELAPOR">Pelapor</option>
            </Select>
          </div>
        </Modal.Body>

        <Modal.Footer className="flex justify-end">
          <ResetButton
            onReset={() => {
              reset({
                name: user.name || '',
                email: user.email || '',
                contactNumber: user.contactNumber || '',
                nikNumber: user.nikNumber || '',
                role: user.role || '',
              });
              setNikDisplay(user.nikMasked || '');
              setIdentitasType(initialType); // reset tipe identitas
            }}
          />
          <Button type="submit" color="blue" isProcessing={isSubmitting}>
            Simpan
          </Button>
          <Button color="gray" onClick={() => setOpen(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default UserEditModal;
