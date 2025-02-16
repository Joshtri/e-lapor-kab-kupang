import Image from "next/image";
import Link from "next/link"
import { Button } from "flowbite-react"
import { HiOutlineUser, HiOutlinePhone } from "react-icons/hi"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
    <div className="mb-12 text-center">
      <Image
        src="/placeholder.svg?height=80&width=240"
        alt="LAPOR MAS WAPRES"
        width={240}
        height={80}
        className="mx-auto mb-8"
      />
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Sampaikan Laporan Anda melalui pilihan kanal berikut ini
      </h1>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <HiOutlineUser className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 font-semibold">Tatap Muka (Registrasi Online)</h2>
            <p className="text-sm text-gray-600">
              Sampaikan langsung di Kantor Sekretariat Wakil Presiden Jln. Kebon Sirih No. 14, Jakarta Pusat
            </p>
          </div>
          <Link href="/registrasi">
            <Button gradientDuoTone="blueToGreen">Daftar</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <HiOutlinePhone className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 font-semibold">WhatsApp</h2>
            <p className="text-sm text-gray-600">Hubungi kami via WhatsApp.</p>
          </div>
          <Button outline gradientDuoTone="greenToBlue">
            Hubungi
          </Button>
        </div>
      </div>
    </div>
  </main>
  );
}
