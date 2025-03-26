"use client";

import { useForm } from "react-hook-form";
import { TextInput, Label, Button } from "flowbite-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  HiOutlineMail, 
  HiOutlineOfficeBuilding, 
  HiOutlineLocationMarker, 
  HiOutlinePhone, 
  HiOutlineGlobe, 
  HiPaperAirplane 
} from "react-icons/hi";

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

      toast.success("Profil OPD berhasil disimpan!", {
        icon: <HiPaperAirplane className="h-5 w-5 text-green-500 rotate-90" />,
      });
      localStorage.setItem("opd_onboarded", "true");
      if (onSuccess) onSuccess();

      router.push("/opd/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menyimpan profil OPD.");
    }
  };

  // Animation variants for form fields
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-purple-100 dark:border-purple-900/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {/* Nama Instansi */}
          <motion.div variants={item}>
            <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
              <HiOutlineOfficeBuilding className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Nama Instansi OPD</span>
            </Label>
            <TextInput
              id="name"
              placeholder="Contoh: Dinas Kesehatan"
              {...register("name", { required: "Nama instansi wajib diisi" })}
              color={errors.name ? "failure" : "gray"}
              className="bg-purple-50 dark:bg-gray-700 border-purple-100 dark:border-purple-900/30 focus:border-purple-500 focus:ring-purple-500"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </motion.div>

          {/* Alamat */}
          <motion.div variants={item}>
            <Label htmlFor="alamat" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
              <HiOutlineLocationMarker className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Alamat Instansi</span>
            </Label>
            <TextInput
              id="alamat"
              placeholder="Contoh: Jl. Soekarno Hatta No. 123"
              {...register("alamat")}
              className="bg-purple-50 dark:bg-gray-700 border-purple-100 dark:border-purple-900/30 focus:border-purple-500 focus:ring-purple-500"
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={item}>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
              <HiOutlineMail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Email Instansi</span>
            </Label>
            <TextInput
              id="email"
              placeholder="instansi@email.com"
              type="email"
              {...register("email", { required: "Email instansi wajib diisi" })}
              color={errors.email ? "failure" : "gray"}
              className="bg-purple-50 dark:bg-gray-700 border-purple-100 dark:border-purple-900/30 focus:border-purple-500 focus:ring-purple-500"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </motion.div>

          {/* Telepon */}
          <motion.div variants={item}>
            <Label htmlFor="telp" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
              <HiOutlinePhone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Nomor Telepon Instansi</span>
            </Label>
            <TextInput
              id="telp"
              placeholder="Contoh: 0380xxxxxx"
              {...register("telp", { required: "Nomor telepon instansi wajib diisi" })}
              color={errors.telp ? "failure" : "gray"}
              className="bg-purple-50 dark:bg-gray-700 border-purple-100 dark:border-purple-900/30 focus:border-purple-500 focus:ring-purple-500"
            />
            {errors.telp && <p className="text-sm text-red-500 mt-1">{errors.telp.message}</p>}
          </motion.div>

          {/* Website */}
          <motion.div variants={item}>
            <Label htmlFor="website" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
              <HiOutlineGlobe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Website Instansi (opsional)</span>
            </Label>
            <TextInput 
              id="website" 
              placeholder="https://opd.go.id" 
              {...register("website")} 
              className="bg-purple-50 dark:bg-gray-700 border-purple-100 dark:border-purple-900/30 focus:border-purple-500 focus:ring-purple-500"
            />
          </motion.div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <Button 
            type="submit" 
            isProcessing={isSubmitting} 
            gradientDuoTone="purpleToPink"
            className="flex items-center justify-center gap-2 w-full"
          >
            {isSubmitting ? (
              "Menyimpan..."
            ) : (
              <>
                <HiPaperAirplane className="h-5 w-5" />
                <span>Kirim Profil Instansi</span>
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

