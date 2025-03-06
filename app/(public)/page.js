"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "flowbite-react";
import { HiOutlinePhone, HiOutlineUserAdd, HiOutlineLogin } from "react-icons/hi";
import AuthRedirectGuard from "@/components/AuthRedirectGuard";


export default function Home() {
  const cardClass = "transform transition-all duration-300 hover:scale-105";
  const innerClass =
    "flex flex-col h-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-xl";
  const contentClass =
    "flex flex-col flex-grow items-center text-center gap-6";
  const iconWrapper = (bgColor, textColor, Icon) => (
    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} ${textColor}`}>
      <Icon className="h-8 w-8" />
    </div>
  );

  return (
    <AuthRedirectGuard>


    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-700 mt-12">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="mb-16 text-center">
          {/* <Image
            src="/placeholder.svg?height=100&width=300"
            alt="E-Lapor Kabupaten Kupang"
            width={300}
            height={100}
            className="mx-auto mb-8 drop-shadow-lg"
          /> */}
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100 drop-shadow-sm">
            Selamat Datang di LAPOR KK BUPATI Kupang
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Layanan Aspirasi dan Pengaduan Online untuk mendukung transparansi dan pelayanan publik di Pemerintah Daerah Kabupaten Kupang.
          </p>
        </div>

        {/* Cards Container */}
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {/* Register Card */}
            <div className={cardClass}>
              <div className={innerClass}>
                <div className={contentClass}>
                  {iconWrapper("bg-purple-100 dark:bg-purple-900", "text-purple-600 dark:text-purple-300", HiOutlineUserAdd)}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-200">Register</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Daftarkan akun Anda untuk mendapatkan akses penuh ke layanan pengaduan dan informasi dari Pemerintah Daerah Kabupaten Kupang.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                  <Link href="/auth/register" className="w-full">
                    <Button
                      color="blue"
                      size="lg"
                      className="w-full"
                    >
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className={cardClass}>
              <div className={innerClass}>
                <div className={contentClass}>
                  {iconWrapper("bg-green-100 dark:bg-green-900", "text-green-600 dark:text-green-300", HiOutlinePhone)}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-200">WhatsApp</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Sampaikan pengaduan dan masukan Anda melalui WhatsApp untuk respons yang cepat dan tepat.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                <div className="flex flex-col gap-4 w-full">
  <Button
    gradientDuoTone="greenToBlue"
    size="lg"
    className="w-full"
    onClick={() => {
      const message = encodeURIComponent(
        "Halo Bupati,\n\nSaya ingin melaporkan...\n\nNama: \nAlamat: \nKeluhan: \n\nTerima kasih."
      );
      window.open(`https://wa.me/6281237159777?text=${message}`, "_blank");
    }}
  >
    Hubungi Bupati
  </Button>

  <Button
    gradientDuoTone="purpleToPink"
    size="lg"
    className="w-full"
    onClick={() => {
      const message = encodeURIComponent(
        "Halo Admin,\n\nSaya ingin menanyakan...\n\nNama: \nPertanyaan: \n\nTerima kasih."
      );
      window.open(`https://wa.me/6281339300533?text=${message}`, "_blank");
    }}
  >
    Hubungi Admin
  </Button>
</div>

                </div>
              </div>
            </div>



            {/* Login Card */}
            <div className={cardClass}>
              <div className={innerClass}>
                <div className={contentClass}>
                  {iconWrapper("bg-blue-100 dark:bg-blue-900", "text-blue-600 dark:text-blue-300", HiOutlineLogin)}
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-200">Login</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Masuk ke akun Anda untuk melacak pengaduan dan berinteraksi dengan layanan kami.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-6">
                  <Link href="/auth/login" className="w-full">
                    <Button
                      color="blue"
                      size="lg"
                      className="w-full"
                    >
                      Masuk
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Butuh bantuan? Hubungi tim support kami di{" "}
            <a href="mailto:support@kupangkab.go.id" className="text-blue-600 hover:underline">
              support@kupangkab.go.id
            </a>
          </p>
        </div>
      </div>
    </main>
    </AuthRedirectGuard>
  );
}
