'use client';

import {
  Modal,
  Button,
  Label,
  TextInput,
  Select,
} from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const UserEditModal = ({ open, setOpen, user, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Prefill data ketika modal dibuka
  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        nikNumber: user.nikNumber || '',
        role: user.role || '',
      });
    }
  }, [user, open, reset]);

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
            <TextInput id="email" type="email" {...register('email')} required />
          </div>

          <div>
            <Label htmlFor="contactNumber" value="Nomor Telepon" />
            <TextInput id="contactNumber" {...register('contactNumber')} />
          </div>

          <div>
            <Label htmlFor="nikNumber" value="NIK" />
            <TextInput id="nikNumber" {...register('nikNumber')} readOnly />
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
