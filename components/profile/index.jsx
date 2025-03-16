"use client";

import axios from "axios";
import { Button, Card, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineKey } from "react-icons/hi";
import { toast } from "sonner";
import PageHeader from "../ui/page-header";
import ChangePasswordModal from "./change-password";

const ProfileManagement = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      setUser(res.data?.user);

      //   console.log("User profile:", res.data);
    } catch (error) {
      console.error("Gagal mengambil profil user:", error);
      toast.error("Gagal mengambil data profil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Memuat data profil...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Profil Saya
      </h1> */}

      <Card className="p-6 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama:
            </span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email:
            </span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button color="blue" size="sm" onClick={() => setOpenModal(true)}>
            <HiOutlineKey className="w-4 h-4 mr-1" />
            Ubah Password
          </Button>
        </div>
      </Card>

      {/* Panggil Modal Ubah Password */}
      <ChangePasswordModal open={openModal} setOpen={setOpenModal} />
    </div>
  );
};

export default ProfileManagement;
