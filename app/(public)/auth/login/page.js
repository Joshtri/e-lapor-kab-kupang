"use client";

import { Card, TextInput, Label, Button } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner"; // Import Toast Notifikasi
import * as z from "zod";

// Skema validasi
const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/auth/login", data);

      if (res.status === 200) {
        toast.success("Login berhasil! Mengarahkan ke dashboard...");
        setTimeout(() => {
          router.push("/pelapor/dashboard");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-md px-4 py-8">
        <Card className="p-8 bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Log In Pengadu / Pelapor</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">RESERVASI LAYANAN PENGADUAN E-LAPOR!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...register("email")}
                color={errors.email ? "failure" : "gray"}
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>

            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                color={errors.password ? "failure" : "gray"}
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>

            <Button type="submit" color="blue" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Masuk"}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Belum punya akun?{" "}
              <a href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Daftar di sini
              </a>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
