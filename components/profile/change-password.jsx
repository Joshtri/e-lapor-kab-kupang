"use client";

import React, { useState } from "react";
import { Modal, Button, TextInput, Spinner } from "flowbite-react";
import axios from "axios";
import { HiOutlineKey } from "react-icons/hi";
import { toast } from "sonner";

const ChangePasswordModal = ({ open, setOpen }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Konfirmasi password baru tidak cocok!");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.patch("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password berhasil diubah!");
      setOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Gagal mengubah password:", error);
      toast.error(error.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="md">
      <Modal.Header>Ubah Password</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <TextInput
            type="password"
            placeholder="Password Saat Ini"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextInput
            type="password"
            placeholder="Password Baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextInput
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="failure" onClick={handleChangePassword} disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" className="mr-2" /> : <HiOutlineKey className="mr-2 w-4 h-4" />}
          Simpan
        </Button>
        <Button color="gray" onClick={() => setOpen(false)}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
