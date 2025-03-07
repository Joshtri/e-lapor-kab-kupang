"use client";

import { useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner"; // Import Toast Notifikasi
import * as z from "zod";

// Skema validasi dengan Zod (dengan batasan NIK hanya angka)
const formSchema = z.object({
  fullName: z.string().min(3, { message: "Nama harus minimal 3 karakter." }),
  nikNumber: z
    .string()
    .length(16, { message: "NIK harus tepat 16 digit." })
    .regex(/^\d+$/, { message: "NIK hanya boleh berisi angka." }), // Hanya angka
  contactNumber: z
    .string()
    .min(10, { message: "Nomor kontak minimal 10 digit." })
    .regex(/^\d+$/, { message: "Nomor kontak hanya boleh berisi angka." }), // Hanya angka
  email: z.string().email({ message: "Email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

export default function RegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await axios.post("/api/auth/register", data);
      toast.success(
        "Pendaftaran berhasil! Anda akan dialihkan ke halaman login.",
      );

      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Terjadi kesalahan saat mendaftar.",
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-16">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <div className="text-center">
            <h2 className="text-2xl font-bold">Buat Akun Lapor KK Bupati</h2>
            <p className="text-gray-500">
              Silakan isi formulir untuk membuat akun Anda.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Nama Lengkap */}
            <div>
              <Label htmlFor="fullName" value="NAMA LENGKAP" />
              <TextInput
                id="fullName"
                type="text"
                placeholder="Masukkan nama lengkap"
                {...register("fullName")}
              />
              {errors.fullName && (
                <span className="text-red-500">{errors.fullName.message}</span>
              )}
            </div>

            {/* NIK */}
            <div>
              <Label htmlFor="nikNumber" value="NOMOR IDENTITAS (NIK)" />
              <TextInput
                id="nikNumber"
                type="text"
                placeholder="Masukkan NIK"
                maxLength={16} // Batasi input maksimal 16 digit
                {...register("nikNumber")}
              />
              {errors.nikNumber && (
                <span className="text-red-500">{errors.nikNumber.message}</span>
              )}
            </div>

            {/* Nomor Kontak */}
            <div>
              <Label htmlFor="contactNumber" value="NOMOR KONTAK" />
              <TextInput
                id="contactNumber"
                type="text"
                placeholder="Masukkan nomor kontak"
                {...register("contactNumber")}
              />
              {errors.contactNumber && (
                <span className="text-red-500">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" value="EMAIL" />
              <TextInput
                id="email"
                type="email"
                placeholder="Masukkan EMAIL"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" value="PASSWORD" />
              <TextInput
                id="password"
                type="password"
                placeholder="Masukkan Password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            <Button type="submit" color="blue" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Daftar"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah memiliki akun?{" "}
                <a
                  href="/auth/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login di sini
                </a>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
