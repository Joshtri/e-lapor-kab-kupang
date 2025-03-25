"use client";

import { useForm } from "react-hook-form";
import { TextInput, Label, Button } from "flowbite-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function OnboardingOPDForm({ userId, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/opd/onboarding/create", {
        ...data,
        staffUserId: userId,
      });

      toast.success("Profil OPD berhasil disimpan!");
      localStorage.setItem("opd_onboarded", "true");
      if (onSuccess) onSuccess();

      router.push("/opd/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menyimpan profil OPD.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="name" value="Nama Instansi OPD" />
        <TextInput
          id="name"
          placeholder="Contoh: Dinas Kesehatan"
          {...register("name", { required: "Nama instansi wajib diisi" })}
          color={errors.name ? "failure" : "gray"}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="alamat" value="Alamat Instansi" />
        <TextInput
          id="alamat"
          placeholder="Contoh: Jl. Soekarno Hatta No. 123"
          {...register("alamat")}
        />
      </div>

      <div>
        <Label htmlFor="email" value="Email Instansi" />
        <TextInput
          id="email"
          placeholder="instansi@email.com"
          type="email"
          {...register("email", { required: "Email instansi wajib diisi" })}
          color={errors.email ? "failure" : "gray"}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="telp" value="Nomor Telepon Instansi" />
        <TextInput
          id="telp"
          placeholder="Contoh: 0380xxxxxx"
          {...register("telp", { required: "Nomor telepon instansi wajib diisi" })}
          color={errors.telp ? "failure" : "gray"}
        />
        {errors.telp && <p className="text-sm text-red-500">{errors.telp.message}</p>}
      </div>

      <div>
        <Label htmlFor="website" value="Website Instansi (opsional)" />
        <TextInput id="website" placeholder="https://opd.go.id" {...register("website")} />
      </div>

      <Button type="submit" isProcessing={isSubmitting} fullSized>
        {isSubmitting ? "Menyimpan..." : "Simpan Profil Instansi"}
      </Button>
    </form>
  );
}
