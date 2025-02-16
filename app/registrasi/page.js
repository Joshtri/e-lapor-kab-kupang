"use client"

import { useState } from "react"
import { Button, Card, Label, TextInput } from "flowbite-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Nama harus minimal 3 karakter.",
  }),
  idNumber: z.string().min(16, {
    message: "Nomor identitas harus 16 digit.",
  }),
  contactNumber: z.string().min(10, {
    message: "Nomor kontak tidak valid.",
  }),
})

// type FormData = z.infer<typeof formSchema>

export default function RegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

    
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <div className="text-center">
          <h2 className="text-2xl font-bold">SEKRETARIAT WAKIL PRESIDEN</h2>
          <p className="text-gray-500">RESERVASI LAYANAN PENGADUAN LAPOR MAS WAPRES!</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="fullName" value="NAMA LENGKAP" />
            </div>
            <TextInput
              id="fullName"
              type="text"
              placeholder="Masukkan nama lengkap"
              {...register("fullName")}
              color={errors.fullName ? "failure" : "gray"}
              helperText={
                errors.fullName ? (
                  <span className="text-red-500">{errors.fullName.message}</span>
                ) : (
                  "Masukkan nama lengkap tanpa gelar sesuai KTP/SIM"
                )
              }
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="idNumber" value="NOMOR IDENTITAS" />
            </div>
            <TextInput
              id="idNumber"
              type="text"
              placeholder="Masukkan NIK/Nomor KTP"
              {...register("idNumber")}
              color={errors.idNumber ? "failure" : "gray"}
              helperText={
                errors.idNumber ? (
                  <span className="text-red-500">{errors.idNumber.message}</span>
                ) : (
                  "Masukkan NIK/Nomor KTP"
                )
              }
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="contactNumber" value="NOMOR KONTAK" />
            </div>
            <TextInput
              id="contactNumber"
              type="text"
              placeholder="Masukkan nomor kontak"
              {...register("contactNumber")}
              color={errors.contactNumber ? "failure" : "gray"}
              helperText={
                errors.contactNumber ? (
                  <span className="text-red-500">{errors.contactNumber.message}</span>
                ) : (
                  "Masukkan nomor kontak tanpa spasi"
                )
              }
            />
          </div>

          <Button type="submit" gradientDuoTone="blueToGreen" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Daftar"}
          </Button>
        </form>
      </Card>
    </div>
    </div>
  )
}

