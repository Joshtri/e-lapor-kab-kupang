"use client";

import { useState } from "react";
import { Card, TextInput, Label, Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import * as z from "zod";
import AuthRedirectGuard from "@/components/AuthRedirectGuard";
import { HiOutlineLogin, HiEye, HiEyeOff } from "react-icons/hi"; // 👀 Import Eye Icons

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 🔥 Toggle state for password

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
      const user = res.data.user;

      toast.success("Login berhasil! Mengarahkan ke dashboard...");

      setTimeout(() => {
        switch (user.role) {
          case "PELAPOR":
            router.push("/pelapor/dashboard");
            break;
          case "ADMIN":
            router.push("/adm/dashboard");
            break;
          case "BUPATI":
            router.push("/bupati-portal/dashboard");
            break;
          default:
            router.push("/");
        }
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.error || "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthRedirectGuard>
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="container mx-auto max-w-md px-4 py-8">
          <Card className="p-8 bg-white/70 dark:bg-gray-800/70">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Selamat Datang di E-Lapor
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-0">
                Silakan masuk untuk mengakses akun Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  {...register("email")}
                  color={errors.email ? "failure" : "gray"}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>

              {/* Password Field with Eye Toggle */}
              <div className="relative">
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"} // 👀 Toggle type
                  placeholder="••••••••"
                  {...register("password")}
                  color={errors.password ? "failure" : "gray"}
                />
                {/* Eye Icon Button */}
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-600 dark:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)} // 🔥 Toggle visibility
                >
                  {showPassword ? <HiEyeOff size={14}  /> : <HiEye size={14} />}
                </button>
                {errors.password && (
                  <span className="text-red-500">{errors.password.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                color="blue"
                className="w-full flex items-center justify-center gap-2"
                size="lg"
                disabled={isSubmitting}
              >
                <HiOutlineLogin className="h-5 w-5" />
                {isSubmitting ? "Memproses..." : "Masuk"}
              </Button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                Belum punya akun?{" "}
                <a
                  href="/auth/register"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Daftar di sini
                </a>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </AuthRedirectGuard>
  );
}
